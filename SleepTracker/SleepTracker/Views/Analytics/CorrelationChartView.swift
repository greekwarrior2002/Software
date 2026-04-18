import SwiftUI
import Charts

struct CorrelationChartView: View {
    let results: [CorrelationResult]
    @Binding var selected: LifestyleCategory

    private var current: CorrelationResult? {
        results.first { $0.category == selected }
    }

    var body: some View {
        GroupBox {
            VStack(alignment: .leading, spacing: 12) {
                Picker("Factor", selection: $selected) {
                    ForEach(LifestyleCategory.allCases, id: \.self) { cat in
                        Text(cat.displayName).tag(cat)
                    }
                }
                .pickerStyle(.menu)

                if let result = current {
                    if result.n < 7 {
                        Text("Not enough data (need 7+ nights with both sleep quality and \(result.category.displayName.lowercased()) logged)")
                            .foregroundStyle(.secondary)
                            .frame(maxWidth: .infinity, minHeight: 120)
                    } else {
                        HStack {
                            Text("r = \(result.r, specifier: "%.2f")")
                                .font(.headline)
                            Text("(\(result.strength), n=\(result.n))")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                        }

                        Chart(result.points) { point in
                            PointMark(
                                x: .value(selected.displayName, point.factorValue),
                                y: .value("Quality", point.quality)
                            )
                            .foregroundStyle(.tint.opacity(0.7))
                        }
                        .chartYScale(domain: 0...5)
                        .frame(height: 180)
                    }
                }
            }
        } label: {
            Text("Factor Correlation")
        }
    }
}
