package controllers

import (
	"depel-backend/internal/models"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// DB holds the shared database connection injected from main.
var DB *gorm.DB

// MediaRoot is the directory served at /media.
// It's set from main.go so uploads and static serving always match.
var MediaRoot string

var nonSlugChars = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, "'", "")
	s = strings.ReplaceAll(s, "\"", "")
	s = nonSlugChars.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	for strings.Contains(s, "--") {
		s = strings.ReplaceAll(s, "--", "-")
	}
	return s
}

func ensureUniqueSlug(categoryID int64, desired string, excludeID int64) string {
	base := slugify(desired)
	if base == "" {
		base = "product"
	}
	try := base
	for i := range 2000 {
		var n int64
		q := DB.Model(&models.Product{}).Where("category_id = ? AND slug = ?", categoryID, try)
		if excludeID > 0 {
			q = q.Where("id <> ?", excludeID)
		}
		q.Count(&n)
		if n == 0 {
			return try
		}
		try = fmt.Sprintf("%s-%d", base, i+2)
	}
	return fmt.Sprintf("%s-%d", base, 9999)
}

func mediaRoot() string {
	if strings.TrimSpace(MediaRoot) != "" {
		return strings.TrimSpace(MediaRoot)
	}
	v := strings.TrimSpace(os.Getenv("MEDIA_ROOT"))
	if v != "" {
		return v
	}
	return filepath.Clean(filepath.Join("media"))
}

func safeFileBase(name string) string {
	name = strings.TrimSpace(name)
	name = filepath.Base(name)
	name = strings.ReplaceAll(name, " ", "-")
	name = strings.ReplaceAll(name, "..", "")
	return name
}

func RequireAdmin() fiber.Handler {
	adminToken := strings.TrimSpace(os.Getenv("ADMIN_TOKEN"))
	return func(c *fiber.Ctx) error {
		if adminToken == "" {
			return c.Next()
		}
		if strings.TrimSpace(c.Get("X-Admin-Token")) != adminToken {
			return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
		}
		return c.Next()
	}
}

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

// ----------------------------
// Admin/Portal endpoints
// ----------------------------

func AdminGetCategories(c *fiber.Ctx) error {
	var categories []models.Category
	DB.Order("name asc").Find(&categories)
	return c.JSON(categories)
}

type AdminProductUpsert struct {
	CategoryID  int64          `json:"category_id"`
	Name        string         `json:"name"`
	Brand       string         `json:"brand"`
	Description string         `json:"description"`
	Image       string         `json:"image"`
	Slug        string         `json:"slug"`
	Attributes  map[string]any `json:"attributes"`
	PartImages  []string       `json:"part_images"`
}

func AdminListProducts(c *fiber.Ctx) error {
	q := DB.Model(&models.Product{}).Order("id desc")
	if v := strings.TrimSpace(c.Query("category_id")); v != "" {
		if id, err := strconv.ParseInt(v, 10, 64); err == nil {
			q = q.Where("category_id = ?", id)
		}
	}

	var products []models.Product
	if err := q.Find(&products).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to list products"})
	}

	// Attach part_images for portal convenience.
	out := make([]fiber.Map, 0, len(products))
	for _, p := range products {
		partImages := []string{}
		var imgs []models.ProductImage
		DB.Select("image").Where("product_id = ?", p.ID).Find(&imgs)
		for _, img := range imgs {
			partImages = append(partImages, img.Image)
		}
		out = append(out, fiber.Map{
			"id":          p.ID,
			"category_id": p.CategoryID,
			"name":        p.Name,
			"brand":       p.Brand,
			"description": p.Description,
			"image":       p.Image,
			"slug":        p.Slug,
			"attributes":  p.Attributes,
			"part_images": partImages,
		})
	}
	return c.JSON(out)
}

func AdminCreateProduct(c *fiber.Ctx) error {
	var req AdminProductUpsert
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid json"})
	}
	req.Slug = strings.TrimSpace(req.Slug)
	if req.CategoryID == 0 || strings.TrimSpace(req.Name) == "" {
		return c.Status(400).JSON(fiber.Map{"error": "category_id and name are required"})
	}
	if req.Attributes == nil {
		req.Attributes = map[string]any{}
	}

	slug := req.Slug
	if slug == "" {
		slug = slugify(req.Name)
	}
	slug = ensureUniqueSlug(req.CategoryID, slug, 0)

	p := models.Product{
		CategoryID:  req.CategoryID,
		Name:        strings.TrimSpace(req.Name),
		Brand:       strings.TrimSpace(req.Brand),
		Description: strings.TrimSpace(req.Description),
		Image:       strings.TrimSpace(req.Image),
		Slug:        slug,
		Attributes:  req.Attributes,
	}
	if err := DB.Create(&p).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create product"})
	}

	for _, img := range req.PartImages {
		img = strings.TrimSpace(img)
		if img == "" {
			continue
		}
		DB.Create(&models.ProductImage{ProductID: p.ID, Image: img})
	}
	return c.JSON(fiber.Map{"id": p.ID})
}

func AdminUpdateProduct(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil || id <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	var p models.Product
	if err := DB.First(&p, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "product not found"})
	}

	var req AdminProductUpsert
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid json"})
	}
	if req.Attributes == nil {
		req.Attributes = map[string]any{}
	}

	p.CategoryID = req.CategoryID
	p.Name = strings.TrimSpace(req.Name)
	p.Brand = strings.TrimSpace(req.Brand)
	p.Description = strings.TrimSpace(req.Description)
	p.Image = strings.TrimSpace(req.Image)
	p.Attributes = req.Attributes

	if p.CategoryID == 0 || p.Name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "category_id and name are required"})
	}

	desired := strings.TrimSpace(req.Slug)
	if desired == "" {
		desired = p.Slug
	}
	if strings.TrimSpace(desired) == "" {
		desired = slugify(p.Name)
	}
	p.Slug = ensureUniqueSlug(p.CategoryID, desired, p.ID)

	if err := DB.Save(&p).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to update product"})
	}

	DB.Where("product_id = ?", p.ID).Delete(&models.ProductImage{})
	for _, img := range req.PartImages {
		img = strings.TrimSpace(img)
		if img == "" {
			continue
		}
		DB.Create(&models.ProductImage{ProductID: p.ID, Image: img})
	}
	return c.JSON(fiber.Map{"ok": true})
}

func AdminDeleteProduct(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil || id <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}
	DB.Where("product_id = ?", id).Delete(&models.ProductImage{})
	if err := DB.Delete(&models.Product{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to delete product"})
	}
	return c.JSON(fiber.Map{"ok": true})
}

// AdminUploadMedia saves an uploaded file under media/<category-slug>/ and returns its public /media/... path.
// Expects multipart/form-data with:
// - file: the file blob
// - category_id: numeric id
func AdminUploadMedia(c *fiber.Ctx) error {
	fh, err := c.FormFile("file")
	if err != nil || fh == nil {
		return c.Status(400).JSON(fiber.Map{"error": "missing file"})
	}
	catStr := strings.TrimSpace(c.FormValue("category_id"))
	catID, err := strconv.ParseInt(catStr, 10, 64)
	if err != nil || catID <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "invalid category_id"})
	}

	var cat models.Category
	if err := DB.First(&cat, catID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "category not found"})
	}

	ext := strings.ToLower(filepath.Ext(fh.Filename))
	switch ext {
	case ".png", ".jpg", ".jpeg", ".webp", ".gif":
	default:
		return c.Status(400).JSON(fiber.Map{"error": "unsupported file type"})
	}

	dir := filepath.Join(mediaRoot(), cat.Slug)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create directory"})
	}

	base := safeFileBase(strings.TrimSuffix(fh.Filename, filepath.Ext(fh.Filename)))
	if base == "" {
		base = "image"
	}
	stamp := time.Now().UTC().Format("20060102-150405")
	filename := fmt.Sprintf("%s-%s%s", slugify(base), stamp, ext)
	dst := filepath.Join(dir, filename)
	if err := c.SaveFile(fh, dst); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to save file"})
	}

	publicPath := filepath.ToSlash(filepath.Join("/media", cat.Slug, filename))
	return c.JSON(fiber.Map{"path": publicPath})
}

// AdminUploadPersonMedia saves an uploaded file under media/people/<group>/ and returns its public /media/... path.
// Expects multipart/form-data with:
// - file: the file blob
// - group: directors | management | employees
func AdminUploadPersonMedia(c *fiber.Ctx) error {
	fh, err := c.FormFile("file")
	if err != nil || fh == nil {
		return c.Status(400).JSON(fiber.Map{"error": "missing file"})
	}
	group := strings.TrimSpace(c.FormValue("group"))
	switch group {
	case "directors", "management", "employees":
	default:
		return c.Status(400).JSON(fiber.Map{"error": "invalid group"})
	}

	ext := strings.ToLower(filepath.Ext(fh.Filename))
	switch ext {
	case ".png", ".jpg", ".jpeg", ".webp", ".gif":
	default:
		return c.Status(400).JSON(fiber.Map{"error": "unsupported file type"})
	}

	dir := filepath.Join(mediaRoot(), "people", group)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create directory"})
	}

	base := safeFileBase(strings.TrimSuffix(fh.Filename, filepath.Ext(fh.Filename)))
	if base == "" {
		base = "person"
	}
	stamp := time.Now().UTC().Format("20060102-150405")
	filename := fmt.Sprintf("%s-%s%s", slugify(base), stamp, ext)
	dst := filepath.Join(dir, filename)
	if err := c.SaveFile(fh, dst); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to save file"})
	}

	publicPath := filepath.ToSlash(filepath.Join("/media", "people", group, filename))
	return c.JSON(fiber.Map{"path": publicPath})
}

func AdminMigrateUnifiedProducts(c *fiber.Ctx) error {
	// Copy legacy per-category tables into the unified Product table (idempotent-ish by (category_id, slug)).
	var categories []models.Category
	DB.Find(&categories)

	created := int64(0)
	skipped := int64(0)

	for _, cat := range categories {
		switch cat.Slug {
		case "minitillers":
			var ps []models.MiniTiller
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Displacement Capacity": lp.DisplacementCapacity,
					"Speed":                 lp.Speed,
					"Type":                  lp.TypeIs,
					"Power":                 lp.Power,
					"Rated Power":           lp.RatedPower,
					"Starting System":       lp.StartingSystem,
					"Cooling System":        lp.CoolingSystem,
					"Gear Box":              lp.GearBox,
					"Gear":                  lp.Gear,
					"Handle Bar":            lp.HandleBar,
					"Headlight":             lp.Headlight,
					"Tyre":                  lp.Tyre,
					"Certification":         lp.Certification,
				}
				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.MiniTillerPart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}

		case "milling-machines":
			var ps []models.MillingMachine
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Production Capacity": lp.ProductionCapacity,
					"Power":               lp.Power,
					"Weight":              lp.Weight,
					"Model":               lp.Model,
					"Power Required":      lp.PowerRequired,
					"Power Consumption":   lp.PowerConsumption,
					"Voltage":             lp.Voltage,
					"Operation Type":      lp.OperationType,
					"Usage":               lp.Usage,
				}
				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.MillingMachinePart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}

		case "harvesting-machines":
			var ps []models.HarvestingMachine
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Power Required":   lp.PowerRequired,
					"Capacity":         lp.Capacity,
					"Fuel Consumption": lp.FuelConsumption,
					"Weight":           lp.Weight,
					"Usage":            lp.Usage,
				}
				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.HarvestingMachinePart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}

		case "planting-and-sowing-machines":
			var ps []models.PlantingSowingMachine
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Operation Type": lp.OperationType,
					"Usage":          lp.Usage,
				}
				// Preserve int field too.
				if lp.NumberOfTransplantingRows != 0 {
					attrs["Number of Transplanting Rows"] = lp.NumberOfTransplantingRows
				}

				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.PlantingSowingMachinePart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}

		case "threshing-machines":
			var ps []models.ThreshingMachine
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Loop Wire Diameter":   lp.LoopWireDiameter,
					"Number of Wire Loops": lp.NumberOfWireLoop,
					"Usage":                lp.Usage,
				}
				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.ThreshingMachinePart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}

		case "weeding-machines":
			var ps []models.WeedingMachine
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Engine":        lp.Engine,
					"Displacement":  lp.Displacement,
					"Working Width": lp.WorkingWidth,
					"Working Depth": lp.WorkingDepth,
					"Gross Weight":  lp.GrossWeight,
					"Back Pack":     lp.BackPack,
					"Certification": lp.Certification,
					"Usage":         lp.Usage,
				}
				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.WeedingMachinePart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}

		case "irrigation-machines":
			var ps []models.IrrigationMachine
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Variant":                lp.Variant,
					"Key Features":           lp.KeyFeatures,
					"Flow Rate":              lp.FlowRate,
					"Certification":          lp.Certification,
					"Recommended Filtration": lp.RecommendedFiltration,
					"Outlet Type":            lp.OutletType,
					"Usage":                  lp.Usage,
				}
				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.IrrigationMachinePart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}

		case "other-machines":
			var ps []models.OtherMachine
			DB.Find(&ps)
			for _, lp := range ps {
				if lp.Slug == "" {
					continue
				}
				var existing models.Product
				if err := DB.Where("category_id = ? AND slug = ?", lp.CategoryID, lp.Slug).First(&existing).Error; err == nil {
					skipped++
					continue
				}

				attrs := map[string]any{
					"Operation Mode": lp.OperationMode,
					"Capacity":       lp.Capacity,
					"Shelling Rate":  lp.ShellingRate,
					"Power Required": lp.PowerRequired,
					"Usage":          lp.Usage,
				}
				p := models.Product{CategoryID: lp.CategoryID, Name: lp.Name, Brand: lp.Brand, Description: lp.Description, Image: lp.Image, Slug: lp.Slug, Attributes: attrs}
				if err := DB.Create(&p).Error; err == nil {
					created++
					var parts []models.OtherMachinePart
					DB.Where("product_id = ?", lp.ID).Find(&parts)
					for _, part := range parts {
						if strings.TrimSpace(part.Image) != "" {
							DB.Create(&models.ProductImage{ProductID: p.ID, Image: part.Image})
						}
					}
				}
			}
		}
	}

	return c.JSON(fiber.Map{
		"ok":      true,
		"created": created,
		"skipped": skipped,
	})
}

func peopleModel(group string) any {
	switch group {
	case "directors":
		return &models.BoardOfDirector{}
	case "management":
		return &models.ManagementTeam{}
	case "employees":
		return &models.Employee{}
	default:
		return nil
	}
}

func AdminListPeople(c *fiber.Ctx) error {
	group := strings.TrimSpace(c.Params("group"))
	m := peopleModel(group)
	if m == nil {
		return c.Status(400).JSON(fiber.Map{"error": "unknown group"})
	}
	if err := DB.Find(m).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to list"})
	}
	return c.JSON(m)
}

type PersonUpsert struct {
	Name     string `json:"name"`
	Position string `json:"position"`
	Bio      string `json:"bio"`
	Image    string `json:"image"`
}

func AdminCreatePerson(c *fiber.Ctx) error {
	group := strings.TrimSpace(c.Params("group"))
	switch group {
	case "directors":
		var req PersonUpsert
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid json"})
		}
		row := models.BoardOfDirector{Name: strings.TrimSpace(req.Name), Position: strings.TrimSpace(req.Position), Bio: strings.TrimSpace(req.Bio), Image: strings.TrimSpace(req.Image)}
		if row.Name == "" {
			return c.Status(400).JSON(fiber.Map{"error": "name is required"})
		}
		if err := DB.Create(&row).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create"})
		}
		return c.JSON(fiber.Map{"id": row.ID})
	case "management":
		var req PersonUpsert
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid json"})
		}
		row := models.ManagementTeam{Name: strings.TrimSpace(req.Name), Position: strings.TrimSpace(req.Position), Bio: strings.TrimSpace(req.Bio), Image: strings.TrimSpace(req.Image)}
		if row.Name == "" {
			return c.Status(400).JSON(fiber.Map{"error": "name is required"})
		}
		if err := DB.Create(&row).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create"})
		}
		return c.JSON(fiber.Map{"id": row.ID})
	case "employees":
		var req PersonUpsert
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid json"})
		}
		row := models.Employee{Name: strings.TrimSpace(req.Name), Position: strings.TrimSpace(req.Position), Bio: strings.TrimSpace(req.Bio), Image: strings.TrimSpace(req.Image)}
		if row.Name == "" {
			return c.Status(400).JSON(fiber.Map{"error": "name is required"})
		}
		if err := DB.Create(&row).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create"})
		}
		return c.JSON(fiber.Map{"id": row.ID})
	default:
		return c.Status(400).JSON(fiber.Map{"error": "unknown group"})
	}
}

func AdminUpdatePerson(c *fiber.Ctx) error {
	group := strings.TrimSpace(c.Params("group"))
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil || id <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	var req PersonUpsert
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid json"})
	}

	switch group {
	case "directors":
		var row models.BoardOfDirector
		if err := DB.First(&row, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "not found"})
		}
		row.Name = strings.TrimSpace(req.Name)
		row.Position = strings.TrimSpace(req.Position)
		row.Bio = strings.TrimSpace(req.Bio)
		row.Image = strings.TrimSpace(req.Image)
		if row.Name == "" {
			return c.Status(400).JSON(fiber.Map{"error": "name is required"})
		}
		DB.Save(&row)
		return c.JSON(fiber.Map{"ok": true})
	case "management":
		var row models.ManagementTeam
		if err := DB.First(&row, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "not found"})
		}
		row.Name = strings.TrimSpace(req.Name)
		row.Position = strings.TrimSpace(req.Position)
		row.Bio = strings.TrimSpace(req.Bio)
		row.Image = strings.TrimSpace(req.Image)
		if row.Name == "" {
			return c.Status(400).JSON(fiber.Map{"error": "name is required"})
		}
		DB.Save(&row)
		return c.JSON(fiber.Map{"ok": true})
	case "employees":
		var row models.Employee
		if err := DB.First(&row, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "not found"})
		}
		row.Name = strings.TrimSpace(req.Name)
		row.Position = strings.TrimSpace(req.Position)
		row.Bio = strings.TrimSpace(req.Bio)
		row.Image = strings.TrimSpace(req.Image)
		if row.Name == "" {
			return c.Status(400).JSON(fiber.Map{"error": "name is required"})
		}
		DB.Save(&row)
		return c.JSON(fiber.Map{"ok": true})
	default:
		return c.Status(400).JSON(fiber.Map{"error": "unknown group"})
	}
}

func AdminDeletePerson(c *fiber.Ctx) error {
	group := strings.TrimSpace(c.Params("group"))
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil || id <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	switch group {
	case "directors":
		DB.Delete(&models.BoardOfDirector{}, id)
		return c.JSON(fiber.Map{"ok": true})
	case "management":
		DB.Delete(&models.ManagementTeam{}, id)
		return c.JSON(fiber.Map{"ok": true})
	case "employees":
		DB.Delete(&models.Employee{}, id)
		return c.JSON(fiber.Map{"ok": true})
	default:
		return c.Status(400).JSON(fiber.Map{"error": "unknown group"})
	}
}
