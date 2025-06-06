from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from src.apps.establishments.entities import (
    CommentEntity,
    CommentImageEntity,
    CommentLikeEntity,
    EstablishmentEntity,
    EstablishmentPhotoEntity,
    EstablishmentSimpleEntity,
)


class CommentLikeSchema(BaseModel):
    id: int
    user_id: UUID
    user_name: str
    comment_id: int

    @staticmethod
    def from_entity(entity: CommentLikeEntity) -> Optional["CommentLikeSchema"]:
        if not entity:
            return None
        return CommentLikeSchema(
            id=entity.id,
            user_id=entity.user_id,
            user_name=entity.user_name,
            comment_id=entity.comment_id,
        )


class CommentImageSchema(BaseModel):
    id: int
    image_url: str

    @staticmethod
    def from_entity(entity: CommentImageEntity) -> Optional["CommentImageSchema"]:
        if not entity:
            return None
        return CommentImageSchema(
            id=entity.id,
            image_url=entity.image_url,
        )


class CommentSchema(BaseModel):
    id: int
    establishment_id: int
    user_id: UUID
    user_name: str
    comment: str
    rating: Optional[float] = None
    images: Optional[List[CommentImageEntity]] = None
    likes: Optional[List[CommentLikeEntity]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @staticmethod
    def from_entity(entity: CommentEntity) -> Optional["CommentSchema"]:
        if not entity:
            return None
        return CommentSchema(
            id=entity.id,
            establishment_id=entity.establishment_id,
            user_id=entity.user_id,
            user_name=entity.user_name,
            comment=entity.comment,
            rating=entity.rating,
            images=entity.images,
            likes=entity.likes,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


class CommentCreateSchema(BaseModel):
    comment: str
    rating: Optional[float] = None


class EstablishmentPhotoSchema(BaseModel):
    id: int
    photo_url: str

    @staticmethod
    def from_entity(
        entity: EstablishmentPhotoEntity,
    ) -> Optional["EstablishmentPhotoSchema"]:
        if not entity:
            return None
        return EstablishmentPhotoSchema(
            id=entity.id,
            photo_url=entity.photo_url,
        )


class EstablishmentSimpleSchema(BaseModel):
    id: int
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    open_at_on_monday_to_friday: Optional[int] = None
    open_at_on_saturday: Optional[int] = None
    owner_name: Optional[str] = None
    active: Optional[bool] = None

    @staticmethod
    def from_entity(
        entity: EstablishmentSimpleEntity,
    ) -> Optional["EstablishmentSimpleSchema"]:
        if not entity:
            return None
        return EstablishmentSimpleSchema(
            id=entity.id,
            latitude=entity.latitude,
            longitude=entity.longitude,
            name=entity.name,
            address=entity.address,
            open_at_on_monday_to_friday=entity.open_at_on_monday_to_friday,
            open_at_on_saturday=entity.open_at_on_saturday,
            owner_name=entity.owner_name,
            active=entity.active,
        )


class EstablishmentSchema(BaseModel):
    id: int
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    phone_number: Optional[int] = None
    email: Optional[str] = None
    website: Optional[str] = None
    open_at_on_monday_to_friday: Optional[int] = None
    open_at_on_saturday: Optional[int] = None
    description: Optional[str] = None
    owner_name: Optional[str] = None
    has_ramp: Optional[bool] = None
    has_parking: Optional[bool] = None
    has_bathroom: Optional[bool] = None
    has_elevator: Optional[bool] = None
    has_wifi: Optional[bool] = None
    has_tactical_floor: Optional[bool] = None
    has_signage: Optional[bool] = None
    has_braille: Optional[bool] = None
    has_audio: Optional[bool] = None
    has_guide: Optional[bool] = None
    has_sign_language: Optional[bool] = None
    has_veterans_discounts: Optional[bool] = None
    raiting: Optional[float] = None
    is_active: Optional[bool] = None
    is_deleted: Optional[bool] = None
    is_public: Optional[bool] = None
    photos: Optional[List[EstablishmentPhotoEntity]] = None
    comments: Optional[List[CommentEntity]] = None
    edrpou: Optional[str] = None
    employees: Optional[int] = None
    avg_monthly_income: Optional[float] = None
    annual_tax: Optional[float] = None
    premises_area: Optional[float] = None
    status: Optional[str] = None
    destruction_date: Optional[str] = None
    direct_loss_est: Optional[float] = None
    indirect_loss_est: Optional[float] = None
    active: Optional[bool] = None
    # description: Optional[str] = None

    @staticmethod
    def from_entity(entity: EstablishmentEntity) -> Optional["EstablishmentSchema"]:
        if not entity:
            return None
        return EstablishmentSchema(
            id=entity.id,
            latitude=entity.latitude,
            longitude=entity.longitude,
            name=entity.name,
            address=entity.address,
            phone_number=entity.phone_number,
            email=entity.email,
            website=entity.website,
            open_at_on_monday_to_friday=entity.open_at_on_monday_to_friday,
            open_at_on_saturday=entity.open_at_on_saturday,
            description=entity.description,
            owner_name=entity.owner_name,
            has_ramp=entity.has_ramp,
            has_parking=entity.has_parking,
            has_bathroom=entity.has_bathroom,
            has_elevator=entity.has_elevator,
            has_wifi=entity.has_wifi,
            has_tactical_floor=entity.has_tactical_floor,
            has_signage=entity.has_signage,
            has_braille=entity.has_braille,
            has_audio=entity.has_audio,
            has_guide=entity.has_guide,
            has_sign_language=entity.has_sign_language,
            has_veterans_discounts=entity.has_veterans_discounts,
            raiting=entity.raiting,
            is_active=entity.is_active,
            is_deleted=entity.is_deleted,
            is_public=entity.is_public,
            # photos=[EstablishmentPhotoSchema.from_entity(photo) for photo in (entity.photos or [])],
            photos=entity.photos,
            comments=[CommentSchema.from_entity(comment) for comment in (entity.comments or [])],
            edrpou=entity.edrpou,
            employees=entity.employees,
            avg_monthly_income=entity.avg_monthly_income,
            annual_tax=entity.annual_tax,
            premises_area=entity.premises_area,
            status=entity.status,
            destruction_date=entity.destruction_date,
            direct_loss_est=entity.direct_loss_est,
            indirect_loss_est=entity.indirect_loss_est,
            active=entity.active,
            # description=entity.description,
        )


class EstablishmentCreateSchema(BaseModel):
    name: str
    latitude: float
    longitude: float
    address: str
    phone: Optional[int] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    open_at_on_monday_to_friday: Optional[int] = None
    open_at_on_saturday: Optional[int] = None
    description: Optional[str] = None
    has_ramp: Optional[bool] = None
    has_parking: Optional[bool] = None
    has_bathroom: Optional[bool] = None
    has_elevator: Optional[bool] = None
    has_tactical_floor: Optional[bool] = None
    has_signage: Optional[bool] = None
    has_braille: Optional[bool] = None
    has_audio: Optional[bool] = None
    has_guide: Optional[bool] = None
    has_sign_language: Optional[bool] = None
    has_veterans_discounts: Optional[bool] = None
    has_wifi: Optional[bool] = None
    edrpou: Optional[str] = None
    # description: Optional[str] = None


class EstablishmentUpdateSchema(BaseModel):
    name: str
    latitude: float
    longitude: float
    address: str
    phone: Optional[int] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    open_at_on_monday_to_friday: Optional[int] = None
    open_at_on_saturday: Optional[int] = None
    description: Optional[str] = None
    has_ramp: Optional[bool] = None
    has_parking: Optional[bool] = None
    has_bathroom: Optional[bool] = None
    has_elevator: Optional[bool] = None
    has_tactical_floor: Optional[bool] = None
    has_signage: Optional[bool] = None
    has_braille: Optional[bool] = None
    has_audio: Optional[bool] = None
    has_guide: Optional[bool] = None
    has_sign_language: Optional[bool] = None
    has_veterans_discounts: Optional[bool] = None
    has_wifi: Optional[bool] = None
    edrpou: Optional[str] = None
    # description: Optional[str] = None