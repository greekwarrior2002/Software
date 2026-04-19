import SwiftUI
import SwiftData

struct LifestyleListView: View {
    @Environment(\.modelContext) private var context
    @Query(sort: \LifestyleEntry.date, order: .reverse) private var entries: [LifestyleEntry]
    @State private var showAddSheet = false

    var body: some View {
        NavigationStack {
            Group {
                if entries.isEmpty {
                    ContentUnavailableView("No Entries", systemImage: "leaf", description: Text("Tap + to log a lifestyle factor."))
                } else {
                    List {
                        ForEach(entries) { entry in
                            LifestyleRowView(entry: entry)
                        }
                        .onDelete { offsets in
                            offsets.map { entries[$0] }.forEach { context.delete($0) }
                            try? context.save()
                        }
                    }
                }
            }
            .navigationTitle("Lifestyle")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button { showAddSheet = true } label: { Image(systemName: "plus") }
                }
            }
            .sheet(isPresented: $showAddSheet) {
                AddLifestyleView()
            }
        }
    }
}

private struct LifestyleRowView: View {
    let entry: LifestyleEntry

    var body: some View {
        HStack {
            Image(systemName: entry.resolvedCategory.systemImage)
                .frame(width: 28)
                .foregroundStyle(.tint)
            VStack(alignment: .leading) {
                Text(entry.resolvedCategory.displayName)
                    .font(.headline)
                Text(entry.date)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Text("\(entry.value, specifier: "%g") \(entry.unit)")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}
