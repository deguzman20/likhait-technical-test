require 'rails_helper'

RSpec.describe Category, type: :model do
  describe 'associations' do
    it 'has many expenses with dependent destroy' do
      association = described_class.reflect_on_association(:expenses)

      expect(association.macro).to eq(:has_many)
      expect(association.options[:dependent]).to eq(:destroy)
    end
  end

  describe 'validations' do
    subject(:category) { described_class.new(name: name) }

    context 'when name is present' do
      let(:name) { 'Food' }

      it { is_expected.to be_valid }
    end

    context 'when name is nil' do
      let(:name) { nil }

      it 'is invalid' do
        expect(category).not_to be_valid
        expect(category.errors[:name]).to include("can't be blank")
      end
    end

    context 'when name is an empty string' do
      let(:name) { '' }

      it 'is invalid' do
        expect(category).not_to be_valid
        expect(category.errors[:name]).to include("can't be blank")
      end
    end

    context 'when name exceeds 100 characters' do
      let(:name) { 'a' * 101 }

      it { is_expected.not_to be_valid }
    end

    context 'when name is exactly 100 characters' do
      let(:name) { 'a' * 100 }

      it { is_expected.to be_valid }
    end
  end

  describe 'dependent destroy' do
    let!(:category) { described_class.create!(name: 'Food') }

    before do
      category.expenses.create!(
        amount: 100,
        description: 'Lunch',
        date: Date.current
      )

      category.expenses.create!(
        amount: 50,
        description: 'Snack',
        date: Date.current
      )
    end

    it 'destroys associated expenses when category is destroyed' do
      expect { category.destroy }.to change(Expense, :count).by(-2)
    end
  end
end
