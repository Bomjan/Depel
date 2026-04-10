package main

import (
	"depel-backend/internal/controllers"
	"depel-backend/internal/models"
	"log"
	"os"
	"path/filepath"
	"runtime"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	_, filename, _, _ := runtime.Caller(0)
	projectRoot := filepath.Join(filepath.Dir(filename), "..", "..", "..")
	dbPath := filepath.Join(projectRoot, "db.sqlite3")
	if v := os.Getenv("DB_PATH"); v != "" {
		dbPath = v
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("could not connect to database: %v", err)
	}

	controllers.DB = db
	log.Printf("Connected to database: %s", dbPath)

	// Create the unified product tables if they don't exist yet.
	if err := db.AutoMigrate(&models.Product{}, &models.ProductImage{}); err != nil {
		log.Fatalf("could not migrate database: %v", err)
	}

	var catCount int64
	db.Model(&models.Category{}).Count(&catCount)
	log.Printf("Found %d categories in the database", catCount)

	app := fiber.New(fiber.Config{
		AppName: "Depel API v1.0",
	})

	app.Use(logger.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept, X-Admin-Token",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	mediaRoot := filepath.Join(projectRoot, "media")
	if v := os.Getenv("MEDIA_ROOT"); v != "" {
		mediaRoot = v
	}
	controllers.MediaRoot = mediaRoot
	app.Static("/media", mediaRoot)

	api := app.Group("/api")
	api.Get("/nav", controllers.GetNav)
	api.Get("/carousel", controllers.GetCarousel)
	api.Get("/people", controllers.GetPeople)
	api.Get("/videos", controllers.GetVideos)
	api.Get("/products/:category_slug/:product_slug", controllers.GetProductDetail)

	// Admin/portal endpoints (optionally protected by ADMIN_TOKEN env var).
	admin := api.Group("/admin", controllers.RequireAdmin())
	admin.Get("/categories", controllers.AdminGetCategories)
	admin.Get("/products", controllers.AdminListProducts)
	admin.Post("/products", controllers.AdminCreateProduct)
	admin.Put("/products/:id", controllers.AdminUpdateProduct)
	admin.Delete("/products/:id", controllers.AdminDeleteProduct)
	admin.Post("/upload", controllers.AdminUploadMedia)
	admin.Post("/upload-person", controllers.AdminUploadPersonMedia)
	admin.Post("/migrate/unified-products", controllers.AdminMigrateUnifiedProducts)

	admin.Get("/people/:group", controllers.AdminListPeople)
	admin.Post("/people/:group", controllers.AdminCreatePerson)
	admin.Put("/people/:group/:id", controllers.AdminUpdatePerson)
	admin.Delete("/people/:group/:id", controllers.AdminDeletePerson)

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "Depel API"})
	})

	addr := ":8000"
	if v := os.Getenv("PORT"); v != "" {
		addr = ":" + v
	}
	log.Printf("Depel API server starting on %s", addr)
	log.Fatal(app.Listen(addr))
}
