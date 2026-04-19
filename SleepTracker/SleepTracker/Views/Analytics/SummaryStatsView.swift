import SwiftUI

struct SummaryStatsView: View {
    let sessions: [SleepSession]

    private var avgDuration: Double {
        guard !sessions.isEmpty else { return 0 }
        return sessions.map { $0.duration / 3600 }.reduce(0, +) / Double(sessions.count)
    }

    private var avgQuality: Double {
        let rated = sessions.compactMap(\.quality)
        guard !rated.isEmpty else { return 0 }
        return Double(rated.reduce(0, +)) / Double(rated.count)
    }

    var body: some View {
        GroupBox("Summary") {
            HStack(spacing: 0) {
                StatCell(label: "Avg Duration", value: String(format: "%.1fh", avgDuration), systemImage: "clock")
                Divider()
                StatCell(label: "Avg Quality", value: avgQuality > 0 ? String(format: "%.1f/5", avgQuality) : "–", systemImage: "star.fill")
                Divider()
                StatCell(label: "Nights Logged", value: "\(sessions.count)", systemImage: "bed.double")
            }
        }
    }
}

private struct StatCell: View {
    let label: String
    let value: String
    let systemImage: String

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: systemImage)
                .foregroundStyle(.tint)
            Text(value)
                .font(.title2.bold())
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }
}
