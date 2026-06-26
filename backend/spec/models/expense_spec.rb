RSpec.describe Expense, type: :model do
  describe 'validations' do
    let(:category) { create(:category, name: 'Food') } # Use FactoryBot for cleaner setup

    subject(:expense) do
      described_class.new(
        amount: 100,
        description: 'Test expense',
        date: expense_date,
        category: category
      )
    end

    context 'when date is in the future' do
      let(:expense_date) { Date.tomorrow }

      it 'is invalid' do
        expect(expense).not_to be_valid
        expect(expense.errors[:date]).to include("must be earlier or today")
      end
    end

    context 'when date is today' do
      let(:expense_date) { Date.today }

      it 'is valid' do
        expect(expense).to be_valid
      end
    end

    context 'when date is in the past' do
      let(:expense_date) { Date.yesterday }

      it 'is valid' do
        expect(expense).to be_valid
      end
    end
  end
end
