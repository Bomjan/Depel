package main

import (
	"depel-backend/internal/controllers"
	"depel-backend/internal/models"
	"log"
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

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("could not connect to database: %v", err)
	}

	controllers.DB = db
	log.Printf("Connected to database: %s", dbPath)

	var catCount int64
	db.Model(&models.Category{}).Count(&catCount)
	log.Printf("Found %d categories in the database", catCount)

	app := fiber.New(fiber.Config{
		AppName: "Depel API v1.0",
	})

	app.Use(logger.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173, http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET",
	}))

	mediaRoot := filepath.Join(projectRoot, "media")
	app.Static("/media", mediaRoot)

	api := app.Group("/api")
	api.Get("/nav", controllers.GetNav)
	api.Get("/carousel", controllers.GetCarousel)
	api.Get("/people", controllers.GetPeople)
	api.Get("/videos", controllers.GetVideos)
	api.Get("/products/:category_slug/:product_slug", controllers.GetProductDetail)

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "Depel API"})
	})

	log.Println("Depel API server starting on :8000")
	log.Fatal(app.Listen(":8000"))
}

