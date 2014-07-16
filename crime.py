

#!/usr/bin/env python3
import csv
import os
import json

from time import sleep
from random import betavariate

from string import ascii_uppercase
import itertools

import requests

KEY = 'AIzaSyDW3Wvk6xWLlLI6Bfu29DuDaseX-g18_mo'
DIRECTORY = os.path.join('data', 'all_results')

def randomsleep():
    'Sleep between zero and 100 seconds.'
    sleep(10 * betavariate(0.7, 8))

def table(table_id):
    '''
    This would tell us the schema, among other things.
    https://developers.google.com/maps-engine/documentation/reference/v1/tables#resource
    '''

    raise NotImplementedError('This doesn\'t work.')

    url = 'https://www.googleapis.com/mapsengine/v1/tables/%s/' % table_id
    params = {
        'key': KEY,
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Referer':  'http://maps.nyc.gov/crime/',
    }
    r = requests.get(url, headers = headers, params = params)
    return r

def table_features(table_id, select, where = None, maxResults = 1000, pageToken = None):
    url = 'https://www.googleapis.com/mapsengine/v1/tables/%s/features/' % table_id

    params = {
        'key': KEY,
        'version': 'published',
        'maxResults': maxResults,
        'select': select,
    }
    if where:
        params['where'] = where
    if pageToken:
        params['pageToken'] = pageToken

    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/24.0',
        'Referer':  'http://maps.nyc.gov/crime/',
    }

    r = requests.get(url, headers = headers, params = params)
    return r

def mkpath(pageToken, table_id):
    filename = pageToken if pageToken else '__%s__' % table_id
    return os.path.join(DIRECTORY, filename)

def mkfp(pageToken, table_id, mode = 'w'):
    return open(mkpath(pageToken, table_id), mode)

def page(table_id, select, pageToken = None):
    '''
    Args: A pageToken or None
    Returns: The next pageToken or None
    '''

    path = mkpath(pageToken, table_id)
    if os.path.exists(path):
        return json.load(open(path))
    else:
        r = table_features(table_id, select, maxResults = 1000, pageToken = pageToken)
        fp = mkfp(pageToken, table_id, mode = 'w')
        fp.write(r.content)
        fp.close()
        return json.loads(r.text)

def features(table_id, select, startPageToken = None):
    if not os.path.exists(DIRECTORY):
        os.makedirs(DIRECTORY)

    if startPageToken:
        pageToken = startPageToken
    else:
        print('Loading data for the initial search, without pageToken')
        results = page(table_id, select)
        for result in results.get('features', []):
            yield result
        pageToken = results.get('nextPageToken')

    while pageToken:
        print('Loading data for pageToken', pageToken)
        results = page(table_id, select, pageToken = pageToken)
        for result in results.get('features', []):
            yield result
        pageToken = results.get('nextPageToken')
        randomsleep()

def geojson(table_id, select):
    return {
        'type': 'FeatureCollection',
        'features': list(features(table_id, select)),
    }

def head(table_id, select):
    path = 'head-%s.geojson' % table_id
    if not os.path.exists(path):
        fp = open(path, 'xb')
        r = table_features(table_id, select, maxResults = 10)
        fp.write(r.content)
        fp.close()

def body(table_id, select):
    path = os.path.join('data',table_id + '.geojson')
    if not os.path.exists(path):
        data = geojson(table_id, select)
        json.dump(data, open(path, 'x'))

def column_names(max_length = 4):
    'Generate a bunch of potential uppercase column names.'
    combinations = itertools.chain(*[itertools.combinations(ascii_uppercase, x) for x in range(1, max_length)])
    permutations = itertools.chain(*[itertools.permutations(c) for c in combinations])
    strings = (''.join(p) for p in permutations)
    return strings

def columns(table_id):
    'Check which column names are present in a table.'
    csvfile = os.path.join('data','column_names-%s.csv' % table_id)
    if os.path.exists(csvfile):
        fp = open(csvfile, 'r')
        fp.readline()
        so_far = set(line.split(',')[0] for line in fp.read().split('\n')[:-1])
        fp.close()

        fp = open(csvfile, 'a')

    else:
        so_far = set()
        fp = open(csvfile, 'x')
        fp.write('column.name,http.response.code\n')

    for c in column_names():
        if c not in so_far:
            r = table_features(table_id, c, maxResults = 0)
            fp.write('%s,%d\n' % (c, r.status_code))
            fp.flush()
    fp.close()

def to_csv(table_id, select):
    path = os.path.join('data',table_id + '.csv')
    fieldnames = ['longitude', 'latitude'] + select.split(',')
    fieldnames.remove('geometry')
    with open(path, 'w') as fp:
        w = csv.DictWriter(fp, fieldnames = fieldnames)
        w.writeheader()
        for feature in features(table_id, select):
            row = {
                'longitude': feature['geometry']['coordinates'][0],
                'latitude': feature['geometry']['coordinates'][1],
            }
            row.update(feature['properties'])
            w.writerow(row)

def main():
    for table_id, select in [
         ('02378420399528461352-17772055697785505571', 'YR,MO,geometry,X,Y,TOT,CR'),
         ('02378420399528461352-11853667273131550346', 'YR,MO,geometry,X,Y,TOT'),
    ]:
        to_csv(table_id, select)
        continue
        head(table_id, select)
        columns(table_id)
        body(table_id, select)

if __name__ == '__main__':
    main()