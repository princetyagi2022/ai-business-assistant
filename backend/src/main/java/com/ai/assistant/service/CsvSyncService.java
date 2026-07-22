package com.ai.assistant.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CsvSyncService {

    private static final Logger log = LoggerFactory.getLogger(CsvSyncService.class);
    private static final DateTimeFormatter BACKUP_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    private final Path dataDir;
    private final Path backupDir;

    public CsvSyncService(
            @Value("${csv.data-dir}") String dataDir,
            @Value("${csv.backup-dir}") String backupDir) {
        this.dataDir = Paths.get(dataDir).toAbsolutePath().normalize();
        this.backupDir = Paths.get(backupDir).toAbsolutePath().normalize();
    }

    public void backup(String fileName) {
        try {
            Files.createDirectories(backupDir);
            Path source = dataDir.resolve(fileName);
            if (!Files.exists(source)) {
                return;
            }
            String timestamp = LocalDateTime.now().format(BACKUP_FORMAT);
            Path target = backupDir.resolve(fileName.replace(".csv", "_" + timestamp + ".csv"));
            Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
            log.info("CSV backup created: {}", target);
        } catch (IOException e) {
            log.warn("Failed to backup CSV {}: {}", fileName, e.getMessage());
        }
    }

    public void syncProjects(List<Map<String, Object>> projects) {
        backup("projects.csv");
        List<String> headers = List.of(
                "id", "project_name", "client_name", "budget", "status", "priority",
                "deadline", "team_members", "description", "documents", "payment_status", "category"
        );
        List<List<String>> rows = projects.stream()
                .map(p -> headers.stream().map(h -> escapeCsv(value(p, h))).toList())
                .toList();
        writeCsv("projects.csv", headers, rows);
    }

    public void syncUsers(List<Map<String, Object>> users) {
        backup("users.csv");
        List<String> headers = List.of("id", "first_name", "last_name", "email", "role", "status", "profile_image_url");
        List<List<String>> rows = users.stream()
                .map(u -> headers.stream().map(h -> escapeCsv(value(u, h))).toList())
                .toList();
        writeCsv("users.csv", headers, rows);
    }

    public List<Map<String, String>> readProjects() {
        return readCsv("projects.csv");
    }

    public List<Map<String, String>> importCsv(String fileName, byte[] content, boolean validateDuplicates) {
        backup(fileName);
        Path target = dataDir.resolve(fileName);
        try {
            Files.createDirectories(dataDir);
            Files.write(target, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
            List<Map<String, String>> rows = readCsv(fileName);
            if (validateDuplicates) {
                validateNoDuplicates(rows, "id");
            }
            return rows;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to import CSV: " + e.getMessage());
        }
    }

    public byte[] exportCsv(String fileName) {
        try {
            Path path = dataDir.resolve(fileName);
            if (!Files.exists(path)) {
                throw new IllegalArgumentException("CSV file not found: " + fileName);
            }
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to export CSV: " + e.getMessage());
        }
    }

    public List<String> listCsvFiles() {
        try {
            if (!Files.exists(dataDir)) {
                return List.of();
            }
            return Files.list(dataDir)
                    .filter(p -> p.toString().endsWith(".csv"))
                    .map(p -> p.getFileName().toString())
                    .sorted()
                    .toList();
        } catch (IOException e) {
            return List.of();
        }
    }

    private void writeCsv(String fileName, List<String> headers, List<List<String>> rows) {
        try {
            Files.createDirectories(dataDir);
            String content = headers.stream().collect(Collectors.joining(",")) + "\n"
                    + rows.stream()
                    .map(row -> String.join(",", row))
                    .collect(Collectors.joining("\n")) + "\n";
            Files.writeString(dataDir.resolve(fileName), content, StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to write CSV: " + e.getMessage());
        }
    }

    private List<Map<String, String>> readCsv(String fileName) {
        try {
            Path path = dataDir.resolve(fileName);
            if (!Files.exists(path)) {
                return List.of();
            }
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
            if (lines.isEmpty()) {
                return List.of();
            }
            String[] headers = lines.get(0).split(",", -1);
            List<Map<String, String>> rows = new ArrayList<>();
            for (int i = 1; i < lines.size(); i++) {
                if (lines.get(i).isBlank()) continue;
                String[] values = lines.get(i).split(",", -1);
                Map<String, String> row = new LinkedHashMap<>();
                for (int j = 0; j < headers.length; j++) {
                    row.put(headers[j].trim(), j < values.length ? unescapeCsv(values[j]) : "");
                }
                rows.add(row);
            }
            return rows;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to read CSV: " + e.getMessage());
        }
    }

    private void validateNoDuplicates(List<Map<String, String>> rows, String key) {
        Set<String> seen = new HashSet<>();
        for (Map<String, String> row : rows) {
            String value = row.get(key);
            if (value != null && !value.isBlank() && !seen.add(value)) {
                throw new IllegalArgumentException("Duplicate record found for " + key + ": " + value);
            }
        }
    }

    private String value(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val == null ? "" : String.valueOf(val);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private String unescapeCsv(String value) {
        if (value == null) return "";
        value = value.trim();
        if (value.startsWith("\"") && value.endsWith("\"")) {
            return value.substring(1, value.length() - 1).replace("\"\"", "\"");
        }
        return value;
    }
}
