# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_02_18_000002) do
  create_table "categories", id: :integer, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamp "updated_at", default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
    t.index ["name"], name: "idx_name"
    t.index ["name"], name: "index_categories_on_name", unique: true
    t.index ["name"], name: "name", unique: true
  end

  create_table "expenses", id: :integer, charset: "utf8mb4", collation: "utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.date "date"
    t.integer "category_id", null: false
    t.string "payer_name", limit: 100
    t.timestamp "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamp "updated_at", default: -> { "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
    t.index ["category_id"], name: "idx_category_id"
    t.index ["created_at"], name: "idx_created_at"
  end

  add_foreign_key "expenses", "categories", name: "expenses_ibfk_1"
end