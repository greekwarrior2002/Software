import SwiftUI

struct ContentView: View {
    var body: some View {
        #if os(macOS)
        NavigationSplitView {
            SidebarView()
        } detail: {
            SleepListView()
        }
        #else
        TabView {
            SleepListView()
                .tabItem { Label("Sleep", systemImage: "bed.double") }
            LifestyleListView()
                .tabItem { Label("Lifestyle", systemImage: "leaf") }
            AnalyticsDashboardView()
                .tabItem { Label("Analytics", systemImage: "chart.xyaxis.line") }
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gear") }
        }
        #endif
    }
}

#if os(macOS)
private struct SidebarView: View {
    var body: some View {
        List {
            NavigationLink(destination: SleepListView()) {
                Label("Sleep", systemImage: "bed.double")
            }
            NavigationLink(destination: LifestyleListView()) {
                Label("Lifestyle", systemImage: "leaf")
            }
            NavigationLink(destination: AnalyticsDashboardView()) {
                Label("Analytics", systemImage: "chart.xyaxis.line")
            }
            NavigationLink(destination: SettingsView()) {
                Label("Settings", systemImage: "gear")
            }
        }
        .navigationTitle("Sleep Tracker")
    }
}
#endif
