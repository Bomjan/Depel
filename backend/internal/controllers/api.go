package controllers

import (
	"depel-backend/internal/models"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// DB holds the shared database connection injected from main.
var DB *gorm.DB

// NavProduct is the compact shape returned by the nav and catalog endpoints.
type NavProduct struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	Image        string `json:"image"`
	CategorySlug string `json:"category_slug"`
}

// NavCategory is what /api/nav returns per category.
type NavCategory struct {
	ID       int64        `json:"id"`
	Name     string       `json:"name"`
	Slug     string       `json:"slug"`
	Products []NavProduct `json:"products"`
}

func mapToNavProducts(products any, categorySlug string) []NavProduct {
	var out []NavProduct
	switch v := products.(type) {
	case []models.Product:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.MiniTiller:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.MillingMachine:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.HarvestingMachine:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.PlantingSowingMachine:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.ThreshingMachine:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.WeedingMachine:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.IrrigationMachine:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	case []models.OtherMachine:
		for _, p := range v {
			out = append(out, NavProduct{p.ID, p.Name, p.Slug, p.Image, categorySlug})
		}
	}
	return out
}

func unifiedProductsReady() bool {
	if DB == nil {
		return false
	}
	if !DB.Migrator().HasTable(&models.Product{}) {
		return false
	}
	var n int64
	DB.Model(&models.Product{}).Count(&n)
	return n > 0
}

// GetNav returns all categories with their products — used to build the
// full navigation menu on the frontend.
func GetNav(c *fiber.Ctx) error {
	var categories []models.Category
	DB.Find(&categories)

	var result []NavCategory
	useUnified := unifiedProductsReady()

	for _, cat := range categories {
		entry := NavCategory{
			ID:   cat.ID,
			Name: cat.Name,
			Slug: cat.Slug,
		}

		if useUnified {
			var ps []models.Product
			DB.Select("id", "name", "slug", "image").
				Where("category_id = ?", cat.ID).
				Find(&ps)
			entry.Products = mapToNavProducts(ps, cat.Slug)
		} else {
			switch cat.Slug {
			case "minitillers":
				var ps []models.MiniTiller
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			case "milling-machines":
				var ps []models.MillingMachine
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			case "harvesting-machines":
				var ps []models.HarvestingMachine
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			case "planting-and-sowing-machines":
				var ps []models.PlantingSowingMachine
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			case "threshing-machines":
				var ps []models.ThreshingMachine
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			case "weeding-machines":
				var ps []models.WeedingMachine
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			case "irrigation-machines":
				var ps []models.IrrigationMachine
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			case "other-machines":
				var ps []models.OtherMachine
				DB.Where("category_id = ?", cat.ID).Find(&ps)
				entry.Products = mapToNavProducts(ps, cat.Slug)
			}
		}

		if entry.Products == nil {
			entry.Products = []NavProduct{}
		}
		result = append(result, entry)
	}

	return c.JSON(result)
}

// GetCarousel returns all carousel images.
func GetCarousel(c *fiber.Ctx) error {
	var images []models.Carousel
	DB.Order("uploaded_to desc").Find(&images)
	return c.JSON(images)
}

// GetPeople returns directors, management team, and employees in one response.
func GetPeople(c *fiber.Ctx) error {
	var directors []models.BoardOfDirector
	var management []models.ManagementTeam
	var employees []models.Employee

	DB.Find(&directors)
	DB.Find(&management)
	DB.Find(&employees)

	return c.JSON(fiber.Map{
		"board_of_directors": directors,
		"management_team":    management,
		"employees":          employees,
	})
}

// GetVideos returns R&D video records.
func GetVideos(c *fiber.Ctx) error {
	var videos []models.PaddyThresherVideo
	DB.Order("uploaded_at desc").Find(&videos)
	return c.JSON(videos)
}

// ProductDetailResponse is the full shape returned for a single product page.
type ProductDetailResponse struct {
	ID         int64             `json:"id"`
	Name       string            `json:"name"`
	Brand      string            `json:"brand"`
	Slug       string            `json:"slug"`
	Image      string            `json:"image"`
	Category   models.Category   `json:"category"`
	Attributes map[string]string `json:"attributes"`
	PartImages []string          `json:"part_images"`
}

func isBlankValue(v string) bool {
	v = strings.TrimSpace(strings.ToLower(v))
	return v == "" || v == "nan" || v == "other" || v == "0"
}

func addAttr(m map[string]string, label, value string) {
	if !isBlankValue(value) {
		m[label] = value
	}
}

// GetProductDetail resolves :category_slug/:product_slug and returns a
// richly structured product response with filtered attributes and part images.
func GetProductDetail(c *fiber.Ctx) error {
	categorySlug := c.Params("category_slug")
	productSlug := c.Params("product_slug")

	var category models.Category
	if err := DB.Where("slug = ?", categorySlug).First(&category).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "category not found"})
	}

	attrs := map[string]string{}
	var name, brand, slug, image string
	var id int64
	var partImages []string

	if unifiedProductsReady() {
		var p models.Product
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}

		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		for k, v := range p.Attributes {
			addAttr(attrs, k, fmt.Sprint(v))
		}

		if DB.Migrator().HasTable(&models.ProductImage{}) {
			var imgs []models.ProductImage
			DB.Select("image").Where("product_id = ?", p.ID).Find(&imgs)
			for _, img := range imgs {
				partImages = append(partImages, img.Image)
			}
		}

		if partImages == nil {
			partImages = []string{}
		}

		return c.JSON(ProductDetailResponse{
			ID:         id,
			Name:       name,
			Brand:      brand,
			Slug:       slug,
			Image:      image,
			Category:   category,
			Attributes: attrs,
			PartImages: partImages,
		})
	}

	switch categorySlug {
	case "minitillers":
		var p models.MiniTiller
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Displacement Capacity", p.DisplacementCapacity)
		addAttr(attrs, "Speed", p.Speed)
		addAttr(attrs, "Type", p.TypeIs)
		addAttr(attrs, "Power", p.Power)
		addAttr(attrs, "Rated Power", p.RatedPower)
		addAttr(attrs, "Starting System", p.StartingSystem)
		addAttr(attrs, "Cooling System", p.CoolingSystem)
		addAttr(attrs, "Gear Box", p.GearBox)
		addAttr(attrs, "Gear", p.Gear)
		addAttr(attrs, "Handle Bar", p.HandleBar)
		addAttr(attrs, "Headlight", p.Headlight)
		addAttr(attrs, "Tyre", p.Tyre)
		addAttr(attrs, "Certification", p.Certification)
		var parts []models.MiniTillerPart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	case "milling-machines":
		var p models.MillingMachine
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Production Capacity", p.ProductionCapacity)
		addAttr(attrs, "Power", p.Power)
		addAttr(attrs, "Weight", p.Weight)
		addAttr(attrs, "Model", p.Model)
		addAttr(attrs, "Power Required", p.PowerRequired)
		addAttr(attrs, "Power Consumption", p.PowerConsumption)
		addAttr(attrs, "Voltage", p.Voltage)
		addAttr(attrs, "Operation Type", p.OperationType)
		addAttr(attrs, "Usage", p.Usage)
		var parts []models.MillingMachinePart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	case "harvesting-machines":
		var p models.HarvestingMachine
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Power Required", p.PowerRequired)
		addAttr(attrs, "Capacity", p.Capacity)
		addAttr(attrs, "Fuel Consumption", p.FuelConsumption)
		addAttr(attrs, "Weight", p.Weight)
		addAttr(attrs, "Usage", p.Usage)
		var parts []models.HarvestingMachinePart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	case "planting-and-sowing-machines":
		var p models.PlantingSowingMachine
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Operation Type", p.OperationType)
		addAttr(attrs, "Usage", p.Usage)
		var parts []models.PlantingSowingMachinePart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	case "threshing-machines":
		var p models.ThreshingMachine
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Loop Wire Diameter", p.LoopWireDiameter)
		addAttr(attrs, "Number of Wire Loops", p.NumberOfWireLoop)
		addAttr(attrs, "Usage", p.Usage)
		var parts []models.ThreshingMachinePart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	case "weeding-machines":
		var p models.WeedingMachine
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Engine", p.Engine)
		addAttr(attrs, "Displacement", p.Displacement)
		addAttr(attrs, "Working Width", p.WorkingWidth)
		addAttr(attrs, "Working Depth", p.WorkingDepth)
		addAttr(attrs, "Gross Weight", p.GrossWeight)
		addAttr(attrs, "Back Pack", p.BackPack)
		addAttr(attrs, "Certification", p.Certification)
		addAttr(attrs, "Usage", p.Usage)
		var parts []models.WeedingMachinePart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	case "irrigation-machines":
		var p models.IrrigationMachine
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Variant", p.Variant)
		addAttr(attrs, "Key Features", p.KeyFeatures)
		addAttr(attrs, "Flow Rate", p.FlowRate)
		addAttr(attrs, "Certification", p.Certification)
		addAttr(attrs, "Recommended Filtration", p.RecommendedFiltration)
		addAttr(attrs, "Outlet Type", p.OutletType)
		addAttr(attrs, "Usage", p.Usage)
		var parts []models.IrrigationMachinePart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	case "other-machines":
		var p models.OtherMachine
		if err := DB.Where("slug = ? AND category_id = ?", productSlug, category.ID).First(&p).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "product not found"})
		}
		id, name, brand, slug, image = p.ID, p.Name, p.Brand, p.Slug, p.Image
		addAttr(attrs, "Operation Mode", p.OperationMode)
		addAttr(attrs, "Capacity", p.Capacity)
		addAttr(attrs, "Shelling Rate", p.ShellingRate)
		addAttr(attrs, "Power Required", p.PowerRequired)
		addAttr(attrs, "Usage", p.Usage)
		var parts []models.OtherMachinePart
		DB.Where("product_id = ?", p.ID).Find(&parts)
		for _, pt := range parts {
			partImages = append(partImages, pt.Image)
		}

	default:
		return c.Status(404).JSON(fiber.Map{"error": "unknown category"})
	}

	if partImages == nil {
		partImages = []string{}
	}

	return c.JSON(ProductDetailResponse{
		ID:         id,
		Name:       name,
		Brand:      brand,
		Slug:       slug,
		Image:      image,
		Category:   category,
		Attributes: attrs,
		PartImages: partImages,
	})
}

