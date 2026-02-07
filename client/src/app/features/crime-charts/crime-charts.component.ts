import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { CrimeService } from '../../core/services/crime.service';
import { YearlyTotal } from '../../core/models/crime.model';

/**
 * Crime Charts component — D3 bar chart replacing the legacy Highcharts.
 *
 * Phase 1: Data fetched from /api/crimes/yearly-totals instead of hardcoded.
 * Phase 3: Enhanced interactivity, transitions, tooltips, responsive resize.
 */
@Component({
  selector: 'app-crime-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crime-charts.component.html',
  styleUrl: './crime-charts.component.scss',
})
export class CrimeChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;

  private readonly crimeService = inject(CrimeService);

  yearlyTotals: YearlyTotal[] = [];
  selectedType: string | null = null;
  showIntro = true;
  loading = true;
  error: string | null = null;

  private resizeObserver?: ResizeObserver;

  ngOnInit(): void {
    this.crimeService.getYearlyTotals().subscribe({
      next: (data) => {
        this.yearlyTotals = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load yearly totals:', err);
        this.error = 'Failed to load chart data from server.';
        this.loading = false;
      },
    });
  }

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

  private findEntry(type: string): YearlyTotal | undefined {
    return this.yearlyTotals.find((t) => t.type === type);
  }

  private renderChart(type: string): void {
    const container = this.chartContainer.nativeElement;
    const entry = this.findEntry(type);
    if (!entry) return;

    const dataset = entry.years.map((year, i) => ({
      year,
      count: entry.data[i],
    }));

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
      .domain(entry.years)
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
