import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

/** Hardcoded historical data — will move to backend API in Phase 1. */
const CHART_DATA: Record<string, { title: string; name: string; data: number[] }> = {
  burglaries: {
    title: 'Burglaries (2000 - 2013)',
    data: [38352, 32763, 31275, 29110, 26976, 24117, 23143, 21762, 20725, 19430, 18600, 18720, 19168, 17429],
    name: 'BURGLARIES',
  },
  murders: {
    title: 'Murders (2000 - 2013)',
    data: [673, 649, 587, 597, 570, 539, 596, 496, 523, 471, 536, 515, 419, 335],
    name: 'MURDERS',
  },
  felonyAssaults: {
    title: 'Felony Assaults (2000 - 2013)',
    data: [25924, 23453, 21147, 19139, 18622, 17750, 17309, 17493, 16284, 16773, 16956, 18482, 19381, 20297],
    name: 'FELONY ASSAULTS',
  },
  rapes: {
    title: 'Rapes (2000 - 2013)',
    data: [2068, 1981, 2144, 2070, 1905, 1858, 1525, 1351, 1299, 1205, 1373, 1420, 1445, 1378],
    name: 'RAPES',
  },
  robberies: {
    title: 'Robberies (2000 - 2013)',
    data: [32562, 28202, 27229, 25989, 24373, 24722, 23739, 21809, 22401, 18601, 19486, 19717, 20144, 19128],
    name: 'ROBBERIES',
  },
  grandLarcenies: {
    title: 'Grand Larcenies (2000 - 2013)',
    data: [49631, 46329, 45771, 46751, 48763, 48243, 46625, 44924, 44242, 39580, 37835, 38501, 42497, 45368],
    name: 'GRAND LARCENIES',
  },
  GLA: {
    title: 'Grand Larcenies of Motor Vehicles (2000 - 2013)',
    data: [35442, 29531, 26656, 23413, 20884, 18246, 15745, 13174, 12482, 10670, 10329, 9314, 8093, 7400],
    name: 'GRAND LARCENIES OF MOTOR VEHICLES',
  },
};

const YEARS = Array.from({ length: 14 }, (_, i) => 2000 + i);

/**
 * Crime Charts component — D3 bar chart replacing the legacy Highcharts implementation.
 *
 * Phase 0: Basic working D3 bar chart with crime type selection.
 * Phase 3: Enhanced interactivity, transitions, tooltips, responsive resize.
 */
@Component({
  selector: 'app-crime-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crime-charts.component.html',
  styleUrl: './crime-charts.component.scss',
})
export class CrimeChartsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;

  readonly crimeTypes = Object.keys(CHART_DATA);
  selectedType: string | null = null;
  showIntro = true;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.selectedType) {
        this.renderChart(this.selectedType);
      }
    });
    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  selectCrimeType(type: string): void {
    this.showIntro = false;
    this.selectedType = type;
    this.renderChart(type);
  }

  getLabel(type: string): string {
    return CHART_DATA[type].name;
  }

  private renderChart(type: string): void {
    const container = this.chartContainer.nativeElement;
    const entry = CHART_DATA[type];
    const dataset = YEARS.map((year, i) => ({ year, count: entry.data[i] }));

    // Clear previous chart
    d3.select(container).selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 40, left: 70 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#eee')
      .style('font-size', '16px')
      .style('font-weight', '700')
      .text(entry.title);

    // Scales
    const x = d3
      .scaleBand<number>()
      .domain(YEARS)
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d.count)! * 1.1])
      .range([height, 0]);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
      .selectAll('text')
      .attr('fill', '#ccc');

    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(6).tickFormat(d3.format(',')))
      .selectAll('text')
      .attr('fill', '#ccc');

    // Style axis lines
    svg.selectAll('.domain, .tick line').attr('stroke', '#555');

    // Bars
    svg
      .selectAll<SVGRectElement, { year: number; count: number }>('.bar')
      .data(dataset)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.year)!)
      .attr('y', (d) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.count))
      .attr('fill', '#AA0036')
      .attr('rx', 2);
  }
}
