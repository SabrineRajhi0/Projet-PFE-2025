package GestionCours.backend.springboot.Config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadConfig.class);

    @Value("${app.upload.base-dir}")
    private String baseDir;

    @Value("${app.upload.elements-dir}")
    private String elementsDir;

    @Value("${app.upload.temp-dir}")
    private String tempDir;

    @PostConstruct
    public void init() {
        try {
            // Create base directory
            createDirectoryIfNotExists(baseDir);
            
            // Create elements directory
            createDirectoryIfNotExists(elementsDir);
            
            // Create temp directory
            createDirectoryIfNotExists(tempDir);

            logger.info("File upload directories initialized successfully:");
            logger.info("Base directory: {}", baseDir);
            logger.info("Elements directory: {}", elementsDir);
            logger.info("Temp directory: {}", tempDir);
        } catch (IOException e) {
            logger.error("Failed to initialize upload directories", e);
            throw new RuntimeException("Failed to initialize upload directories", e);
        }
    }

    private void createDirectoryIfNotExists(String dirPath) throws IOException {
        Path path = Paths.get(dirPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            logger.info("Created directory: {}", dirPath);
        }
        
        // Verify write permissions
        File dir = path.toFile();
        if (!dir.canWrite()) {
            throw new IOException("No write permission for directory: " + dirPath);
        }
    }


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("classpath:/uploads/");
    }
} 