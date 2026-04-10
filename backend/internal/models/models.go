package models

import (
	"time"
)

// Category maps to the ass_category table in the existing Django database.
type Category struct {
	ID   int64  `gorm:"column:id;primaryKey"`
	Name string `gorm:"column:name"`
	Slug string `gorm:"column:slug"`
}

func (Category) TableName() string { return "ass_category" }

// Carousel maps to ass_carousel.
type Carousel struct {
	ID         int64     `gorm:"column:id;primaryKey"`
	Image      string    `gorm:"column:image"`
	UploadedTo time.Time `gorm:"column:uploaded_to"`
}

func (Carousel) TableName() string { return "ass_carousel" }

// BoardOfDirector maps to ass_boardofdirector.
type BoardOfDirector struct {
	ID       int64  `gorm:"column:id;primaryKey"`
	Name     string `gorm:"column:name"`
	Position string `gorm:"column:position"`
	Bio      string `gorm:"column:bio"`
	Image    string `gorm:"column:image"`
}

func (BoardOfDirector) TableName() string { return "ass_boardofdirector" }

// ManagementTeam maps to ass_managementteam.
type ManagementTeam struct {
	ID       int64  `gorm:"column:id;primaryKey"`
	Name     string `gorm:"column:name"`
	Position string `gorm:"column:position"`
	Bio      string `gorm:"column:bio"`
	Image    string `gorm:"column:image"`
}

func (ManagementTeam) TableName() string { return "ass_managementteam" }

// Employee maps to ass_employee.
type Employee struct {
	ID       int64  `gorm:"column:id;primaryKey"`
	Name     string `gorm:"column:name"`
	Position string `gorm:"column:position"`
	Bio      string `gorm:"column:bio"`
	Image    string `gorm:"column:image"`
}

func (Employee) TableName() string { return "ass_employee" }

// PaddyThresherVideo maps to ass_paddythreshervideo.
type PaddyThresherVideo struct {
	ID          int64     `gorm:"column:id;primaryKey"`
	Title       string    `gorm:"column:title"`
	Description string    `gorm:"column:description"`
	Video       string    `gorm:"column:video"`
	UploadedAt  time.Time `gorm:"column:uploaded_at"`
}

func (PaddyThresherVideo) TableName() string { return "ass_paddythreshervideo" }

// MiniTiller maps to ass_minitiller, inheriting the base product fields.
type MiniTiller struct {
	ID                   int64  `gorm:"column:id;primaryKey"`
	CategoryID           int64  `gorm:"column:category_id"`
	Name                 string `gorm:"column:name"`
	Brand                string `gorm:"column:brand"`
	Description          string `gorm:"column:description"`
	Image                string `gorm:"column:image"`
	Slug                 string `gorm:"column:slug"`
	DisplacementCapacity string `gorm:"column:displacement_capacity"`
	Speed                string `gorm:"column:speed"`
	TypeIs               string `gorm:"column:type_is"`
	Power                string `gorm:"column:power"`
	RatedPower           string `gorm:"column:rated_power"`
	StartingSystem       string `gorm:"column:starting_system"`
	CoolingSystem        string `gorm:"column:cooling_system"`
	GearBox              string `gorm:"column:gear_box"`
	Gear                 string `gorm:"column:gear"`
	HandleBar            string `gorm:"column:handle_bar"`
	Headlight            string `gorm:"column:headlight"`
	Tyre                 string `gorm:"column:tyre"`
	Certification        string `gorm:"column:certification"`
}

func (MiniTiller) TableName() string { return "ass_minitiller" }

// MillingMachine maps to ass_millingmachine.
type MillingMachine struct {
	ID                 int64  `gorm:"column:id;primaryKey"`
	CategoryID         int64  `gorm:"column:category_id"`
	Name               string `gorm:"column:name"`
	Brand              string `gorm:"column:brand"`
	Description        string `gorm:"column:description"`
	Image              string `gorm:"column:image"`
	Slug               string `gorm:"column:slug"`
	ProductionCapacity string `gorm:"column:production_capacity"`
	Power              string `gorm:"column:power"`
	Weight             string `gorm:"column:weight"`
	Model              string `gorm:"column:model"`
	PowerRequired      string `gorm:"column:power_required"`
	PowerConsumption   string `gorm:"column:power_consumption"`
	Voltage            string `gorm:"column:voltage"`
	OperationType      string `gorm:"column:operation_type"`
	Usage              string `gorm:"column:usage"`
}

func (MillingMachine) TableName() string { return "ass_millingmachine" }

// HarvestingMachine maps to ass_harvestingmachine.
type HarvestingMachine struct {
	ID              int64  `gorm:"column:id;primaryKey"`
	CategoryID      int64  `gorm:"column:category_id"`
	Name            string `gorm:"column:name"`
	Brand           string `gorm:"column:brand"`
	Description     string `gorm:"column:description"`
	Image           string `gorm:"column:image"`
	Slug            string `gorm:"column:slug"`
	PowerRequired   string `gorm:"column:power_required"`
	Capacity        string `gorm:"column:capacity"`
	FuelConsumption string `gorm:"column:fuel_consumption"`
	Weight          string `gorm:"column:weight"`
	Usage           string `gorm:"column:usage"`
}

func (HarvestingMachine) TableName() string { return "ass_harvestingmachine" }

// PlantingSowingMachine maps to ass_plantingsowingmachine.
type PlantingSowingMachine struct {
	ID                       int64  `gorm:"column:id;primaryKey"`
	CategoryID               int64  `gorm:"column:category_id"`
	Name                     string `gorm:"column:name"`
	Brand                    string `gorm:"column:brand"`
	Description              string `gorm:"column:description"`
	Image                    string `gorm:"column:image"`
	Slug                     string `gorm:"column:slug"`
	OperationType            string `gorm:"column:operation_type"`
	Usage                    string `gorm:"column:usage"`
	NumberOfTransplantingRows int    `gorm:"column:number_of_transplanting_rows"`
}

func (PlantingSowingMachine) TableName() string { return "ass_plantingsowingmachine" }

// ThreshingMachine maps to ass_threshingmachine.
type ThreshingMachine struct {
	ID               int64  `gorm:"column:id;primaryKey"`
	CategoryID       int64  `gorm:"column:category_id"`
	Name             string `gorm:"column:name"`
	Brand            string `gorm:"column:brand"`
	Description      string `gorm:"column:description"`
	Image            string `gorm:"column:image"`
	Slug             string `gorm:"column:slug"`
	LoopWireDiameter string `gorm:"column:loop_wire_diameter"`
	NumberOfWireLoop string `gorm:"column:number_of_wire_loop"`
	Usage            string `gorm:"column:usage"`
}

func (ThreshingMachine) TableName() string { return "ass_threshingmachine" }

// WeedingMachine maps to ass_weedingmachine.
type WeedingMachine struct {
	ID            int64  `gorm:"column:id;primaryKey"`
	CategoryID    int64  `gorm:"column:category_id"`
	Name          string `gorm:"column:name"`
	Brand         string `gorm:"column:brand"`
	Description   string `gorm:"column:description"`
	Image         string `gorm:"column:image"`
	Slug          string `gorm:"column:slug"`
	Engine        string `gorm:"column:engine"`
	Displacement  string `gorm:"column:displacement"`
	WorkingWidth  string `gorm:"column:working_width"`
	WorkingDepth  string `gorm:"column:working_depth"`
	GrossWeight   string `gorm:"column:gross_weight"`
	BackPack      string `gorm:"column:back_pack"`
	Certification string `gorm:"column:certification"`
	Usage         string `gorm:"column:usage"`
}

func (WeedingMachine) TableName() string { return "ass_weedingmachine" }

// IrrigationMachine maps to ass_irrigationmachine.
type IrrigationMachine struct {
	ID                    int64  `gorm:"column:id;primaryKey"`
	CategoryID            int64  `gorm:"column:category_id"`
	Name                  string `gorm:"column:name"`
	Brand                 string `gorm:"column:brand"`
	Description           string `gorm:"column:description"`
	Image                 string `gorm:"column:image"`
	Slug                  string `gorm:"column:slug"`
	Variant               string `gorm:"column:variant"`
	KeyFeatures           string `gorm:"column:key_features"`
	FlowRate              string `gorm:"column:flow_rate"`
	Certification         string `gorm:"column:certification"`
	RecommendedFiltration string `gorm:"column:recommended_filtration"`
	OutletType            string `gorm:"column:outlet_type"`
	Usage                 string `gorm:"column:usage"`
}

func (IrrigationMachine) TableName() string { return "ass_irrigationmachine" }

// OtherMachine maps to ass_othermachine.
type OtherMachine struct {
	ID            int64  `gorm:"column:id;primaryKey"`
	CategoryID    int64  `gorm:"column:category_id"`
	Name          string `gorm:"column:name"`
	Brand         string `gorm:"column:brand"`
	Description   string `gorm:"column:description"`
	Image         string `gorm:"column:image"`
	Slug          string `gorm:"column:slug"`
	OperationMode string `gorm:"column:operation_mode"`
	Capacity      string `gorm:"column:capacity"`
	ShellingRate  string `gorm:"column:shelling_rate"`
	PowerRequired string `gorm:"column:power_required"`
	Usage         string `gorm:"column:usage"`
}

func (OtherMachine) TableName() string { return "ass_othermachine" }

// Part image models — used to show additional angles of each product.
type MiniTillerPart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (MiniTillerPart) TableName() string { return "ass_minitillerpart" }

type MillingMachinePart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (MillingMachinePart) TableName() string { return "ass_millingmachinepart" }

type HarvestingMachinePart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (HarvestingMachinePart) TableName() string { return "ass_harvestingmachinepart" }

type PlantingSowingMachinePart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (PlantingSowingMachinePart) TableName() string { return "ass_plantingsowingmachinepart" }

type ThreshingMachinePart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (ThreshingMachinePart) TableName() string { return "ass_threshingmachinepart" }

type WeedingMachinePart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (WeedingMachinePart) TableName() string { return "ass_weedingmachinepart" }

type IrrigationMachinePart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (IrrigationMachinePart) TableName() string { return "ass_irrigationmachinepart" }

type OtherMachinePart struct {
	ID        int64  `gorm:"column:id;primaryKey"`
	ProductID int64  `gorm:"column:product_id"`
	Image     string `gorm:"column:image"`
}

func (OtherMachinePart) TableName() string { return "ass_othermachinepart" }

// Unified product storage (single table) — optional migration path.
type Product struct {
	ID          int64             `gorm:"primaryKey" json:"id"`
	CategoryID  int64             `gorm:"index" json:"category_id"`
	Name        string            `json:"name"`
	Brand       string            `json:"brand"`
	Description string            `json:"description"`
	Image       string            `json:"image"`
	Slug        string            `gorm:"index" json:"slug"`
	Attributes  map[string]any    `gorm:"serializer:json" json:"attributes"`
}

type ProductImage struct {
	ID        int64  `gorm:"primaryKey" json:"id"`
	ProductID int64  `gorm:"index" json:"product_id"`
	Image     string `json:"image"`
}

