import enum

class CartStatusEnum(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    canceled = "canceled"

class TheaterDaysEnum(str, enum.Enum):
    odd = "odd"
    even = "even"