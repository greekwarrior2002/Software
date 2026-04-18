import SwiftUI
import SwiftData

struct AddSleepView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var context
    @State private var vm = LogEntryViewModel()

    var body: some View {
        NavigationStack {
            Form {
                Section("Times") {
                    DatePicker("Bedtime", selection: $vm.startTime)
                    DatePicker("Wake time", selection: $vm.endTime)
                }
                Section("Quality") {
                    Picker("Rating", selection: Binding(
                        get: { vm.quality ?? 0 },
                        set: { vm.quality = $0 == 0 ? nil : $0 }
                    )) {
                        Text("Not rated").tag(0)
                        ForEach(1...5, id: \.self) { i in
                            Text(String(repeating: "★", count: i)).tag(i)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                Section("Notes") {
                    TextField("Optional notes", text: $vm.notes, axis: .vertical)
                        .lineLimit(3...6)
                }
            }
            .navigationTitle("Log Sleep")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        try? vm.saveSleepSession(context: context)
                        dismiss()
                    }
                    .disabled(vm.endTime <= vm.startTime)
                }
            }
        }
    }
}
