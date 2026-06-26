class Expense < ApplicationRecord
  belongs_to :category
  validates :date, comparison: { less_than_or_equal_to: -> { Date.today }, message: "must be earlier or today" }
end
