import SwiftUI
import SwiftData

struct AddLifestyleView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var context
    @State private var vm = LogEntryViewModel()

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    DatePicker("Date", selection: $vm.factorDate, displayedComponents: .date)
                    Picker("Category", selection: $vm.factorCategory) {
                        ForEach(LifestyleCategory.allCases, id: \.self) { cat in
                            Label(cat.displayName, systemImage: cat.systemImage).tag(cat)
                        }
                    }
                }
                Section("Amount") {
                    HStack {
                        TextField("Value", text: $vm.factorValue)
                            .keyboardType(.decimalPad)
                        Text(vm.factorCategory.defaultUnit)
                            .foregroundStyle(.secondary)
                    }
                }
                Section("Notes") {
                    TextField("Optional notes", text: $vm.factorNotes, axis: .vertical)
                        .lineLimit(2...4)
                }
            }
            .navigationTitle("Log Factor")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        try? vm.saveLifestyleEntry(context: context)
                        dismiss()
                    }
                    .disabled(Double(vm.factorValue) == nil)
                }
            }
        }
    }
}
