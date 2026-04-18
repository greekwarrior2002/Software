import SwiftUI
import SwiftData
import Charts

struct AnalyticsDashboardView: View {
    @Query private var sessions: [SleepSession]
    @Query private var entries: [LifestyleEntry]
    @State private var analytics = AnalyticsViewModel()
    @State private var selectedCategory: LifestyleCategory = .caffeine

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    SummaryStatsView(sessions: sessions)
                    TrendChartView(aggregates: analytics.weeklyAggregates(sessions: sessions))
                    CorrelationChartView(
                        results: analytics.correlations(sessions: sessions, entries: entries),
                        selected: $selectedCategory
                    )
                }
                .padding()
            }
            .navigationTitle("Analytics")
        }
    }
}
