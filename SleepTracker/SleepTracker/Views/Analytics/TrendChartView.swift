import SwiftUI
import Charts

struct TrendChartView: View {
    let aggregates: [WeeklyAggregate]

    var body: some View {
        GroupBox("Sleep Quality Trend") {
            if aggregates.isEmpty {
                Text("Not enough data")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, minHeight: 120)
            } else {
                Chart(aggregates) { week in
                    LineMark(
                        x: .value("Week", week.weekStart, unit: .weekOfYear),
                        y: .value("Quality", week.avgQuality)
                    )
                    .interpolationMethod(.catmullRom)
                    .foregroundStyle(.tint)

                    AreaMark(
                        x: .value("Week", week.weekStart, unit: .weekOfYear),
                        y: .value("Quality", week.avgQuality)
                    )
                    .interpolationMethod(.catmullRom)
                    .foregroundStyle(.tint.opacity(0.15))
                }
                .chartYScale(domain: 0...5)
                .chartYAxis {
                    AxisMarks(values: [1, 2, 3, 4, 5])
                }
                .frame(height: 160)
            }
        }
    }
}
