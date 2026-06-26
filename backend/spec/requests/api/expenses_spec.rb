require 'rails_helper'

RSpec.describe "Api::Expenses", type: :request do
  let!(:food_category) { create(:category, name: "Food") }
  let!(:transport_category) { create(:category, name: "Transport") }

  describe "GET /api/expenses" do
    let!(:expense1) { create(:expense, description: "Lunch", amount: 100.00, category: food_category, date: Date.today) }
    let!(:expense2) { create(:expense, description: "Taxi", amount: 50.00, category: transport_category, date: Date.today) }

    it "returns all expenses with category information" do
      get "/api/expenses"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(2)
    end

    it "returns expenses in descending order by created_at" do
      get "/api/expenses"

      json = JSON.parse(response.body)
      expect(json.first["id"]).to eq(expense2.id)
      expect(json.last["id"]).to eq(expense1.id)
    end
  end

  describe "POST /api/expenses" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          expense: {
            description: "Team Lunch",
            amount: 150.50,
            category_id: food_category.id,
            date: Date.today
          }
        }
      end

      it "creates a new expense" do
        expect {
          post "/api/expenses", params: valid_params, as: :json
        }.to change(Expense, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["description"]).to eq("Team Lunch")
        expect(json["amount"]).to eq(150.5)
      end
    end

    context "with invalid parameters" do
      let(:invalid_params) do |description, amount, date|
        {
          expense: {
            description: description,
            amount: amount,
            category_id: food_category.id,
            date: date
          }
        }
      end

      it "rejects negative amounts" do
        params = invalid_params.call("Invalid expense", -100.00, Date.today)

        expect {
          post "/api/expenses", params: params, as: :json
        }.not_to change(Expense, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Amount must be greater than 0")
      end

      it "rejects empty descriptions" do
        params = invalid_params.call("", 100.00, Date.today)

        expect {
          post "/api/expenses", params: params, as: :json
        }.not_to change(Expense, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Description can't be blank")
      end

      it "rejects future dates" do
        params = invalid_params.call("Future expense", 100.00, Date.tomorrow)

        expect {
          post "/api/expenses", params: params, as: :json
        }.not_to change(Expense, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Date must be today or earlier")
      end
    end
  end
end