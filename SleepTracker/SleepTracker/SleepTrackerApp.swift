import SwiftUI
import SwiftData

@main
struct SleepTrackerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(
            for: [SleepSession.self, LifestyleEntry.self],
            cloudKitDatabase: .automatic
        )
    }
}
