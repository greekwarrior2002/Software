import SwiftUI
import SwiftData

struct SleepListView: View {
    @Environment(\.modelContext) private var context
    @Query(sort: \SleepSession.startTime, order: .reverse) private var sessions: [SleepSession]
    @State private var viewModel = SleepListViewModel()
    @State private var showAddSheet = false

    var body: some View {
        NavigationStack {
            Group {
                if sessions.isEmpty {
                    ContentUnavailableView("No Sleep Records", systemImage: "bed.double", description: Text("Tap + to log a night's sleep or refresh from Apple Health."))
                } else {
                    List {
                        ForEach(sessions) { session in
                            NavigationLink(destination: SleepDetailView(session: session)) {
                                SleepRowView(session: session)
                            }
                        }
                        .onDelete { offsets in
                            let toDelete = offsets.map { sessions[$0] }
                            viewModel.delete(toDelete, context: context)
                        }
                    }
                }
            }
            .navigationTitle("Sleep")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button { showAddSheet = true } label: { Image(systemName: "plus") }
                }
                ToolbarItem(placement: .secondaryAction) {
                    Button {
                        Task { await viewModel.refreshFromHealthKit(context: context) }
                    } label: {
                        Label("Refresh from Health", systemImage: "heart.text.square")
                    }
                    .disabled(viewModel.isRefreshing)
                }
            }
            .sheet(isPresented: $showAddSheet) {
                AddSleepView()
            }
            .alert("Error", isPresented: .init(
                get: { viewModel.errorMessage != nil },
                set: { if !$0 { viewModel.errorMessage = nil } }
            )) {
                Button("OK", role: .cancel) { viewModel.errorMessage = nil }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
        }
    }
}

private struct SleepRowView: View {
    let session: SleepSession

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(session.startTime, style: .date)
                    .font(.headline)
                Spacer()
                if let q = session.quality {
                    Label("\(q)/5", systemImage: "star.fill")
                        .font(.subheadline)
                        .foregroundStyle(.yellow)
                }
            }
            HStack {
                Text("\(session.startTime, style: .time) – \(session.endTime, style: .time)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Spacer()
                Text(durationText)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 2)
    }

    private var durationText: String {
        let h = session.durationMinutes / 60
        let m = session.durationMinutes % 60
        return m == 0 ? "\(h)h" : "\(h)h \(m)m"
    }
}
