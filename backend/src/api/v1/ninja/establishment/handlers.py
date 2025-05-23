from typing import List

from django.conf import settings
from django.http import HttpRequest
from src.apps.establishments.services.diia_city import fetch_residents
from ninja import File, Query
from ninja.constants import NOT_SET
from ninja.files import UploadedFile
from ninja_extra import api_controller, permissions, route
from ninja_jwt.authentication import JWTAuth
from src.api.v1.ninja.base_schemas import ApiResponse, StatusOkSchema
from src.api.v1.ninja.establishment.schemas import (
    EstablishmentCreateSchema,
    EstablishmentSchema,
    EstablishmentSimpleSchema,
    EstablishmentUpdateSchema,
    CommentSchema,
    CommentLikeSchema,
    CommentCreateSchema,
)
import requests as req
from src.apps.establishments.services.establishments import (
    EstablishmentPhotoService, EstablishmentService,
    ORMEstablishmentPhotoService, ORMEstablishmentService,
)
from src.apps.establishments.services.comments import(
    CommentService,
    ORMCommentService,
)
from src.apps.establishments.services.routes import generate_random_route


@api_controller(
    "/establishments",
    auth=NOT_SET,
    permissions=[permissions.AllowAny],
)
class EstablishmentController:
    def __init__(self) -> None:
        super().__init__()
        self.establishment_service: EstablishmentService = ORMEstablishmentService()
        self.establishment_photo_service: EstablishmentPhotoService = ORMEstablishmentPhotoService()
        self.establishment_comment_service: CommentService = ORMCommentService()

    @route.get(
        "/generate_route",
        response=ApiResponse[dict],
        auth=NOT_SET,
        permissions=[permissions.AllowAny],
    )
    def generate_route(
        self,
        request: HttpRequest,
        lat_a: float = Query(None),
        lon_a: float = Query(None),
        lat_b: float = Query(None),
        lon_b: float = Query(None),
    ) -> ApiResponse[dict]:
        route = generate_random_route(
            latA=lat_a,
            lonA=lon_a,
            latB=lat_b,
            lonB=lon_b,
        )
        
        return ApiResponse(
            data={
                "data": route,
                },
        )


    @route.get(
        "/list",
        response=ApiResponse[List[EstablishmentSimpleSchema]],
        auth=NOT_SET,
        permissions=[permissions.AllowAny],
    )
    def get_establishments_list(
        self,
        request: HttpRequest,
        latitude: float = Query(None),
        longitude: float = Query(None),
        name: str = Query(None),
        address: str = Query(None),
        open_at_on_monday_to_friday: int = Query(None),
        open_at_on_saturday: int = Query(None),
        description: str = Query(None),
        owner_ids: str = Query(None),
        has_ramp: bool = Query(None),
        has_parking: bool = Query(None),
        has_bathroom: bool = Query(None),
        has_elevator: bool = Query(None),
        has_tactical_floor: bool = Query(None),
        has_signage: bool = Query(None),
        has_braille: bool = Query(None),
        has_audio: bool = Query(None),
        has_guide: bool = Query(None),
        has_sign_language: bool = Query(None),
        has_veterans_discounts: bool = Query(None),
        raiting: float = Query(None),
        is_active: bool = Query(None),
        is_deleted: bool = Query(None),
        is_verified: bool = Query(None),
        is_public: bool = Query(None),
        has_wifi: bool = Query(None),
    ) -> ApiResponse[List[EstablishmentSimpleSchema]]:
        establishments_list = self.establishment_service.get_all_establishments(
            latitude=latitude,
            longitude=longitude,
            name=name,
            address=address,
            open_at_on_monday_to_friday=open_at_on_monday_to_friday,
            open_at_on_saturday=open_at_on_saturday,
            description=description,
            owner_ids=owner_ids,
            has_ramp=has_ramp,
            has_parking=has_parking,
            has_bathroom=has_bathroom,
            has_elevator=has_elevator,
            has_tactical_floor=has_tactical_floor,
            has_signage=has_signage,
            has_braille=has_braille,
            has_audio=has_audio,
            has_guide=has_guide,
            has_sign_language=has_sign_language,
            has_veterans_discounts=has_veterans_discounts,
            raiting=raiting,
            is_active=is_active,
            is_deleted=is_deleted,
            is_verified=is_verified,
            is_public=is_public,
            has_wifi=has_wifi,
        )

        data = [EstablishmentSimpleSchema.from_entity(establishment) for establishment in establishments_list]

        return ApiResponse(
            data=data,
        )

    @route.get(
        "/{establishment_id}",
        response=ApiResponse[EstablishmentSchema],
        auth=NOT_SET,
        permissions=[permissions.AllowAny],
    )
    def get_establishment(
        self,
        request: HttpRequest,
        establishment_id: int,
    # ) -> ApiResponse[EstablishmentSchema]:
    ) -> ApiResponse[dict]:
        establishment = self.establishment_service.get_establishment_by_id(establishment_id)

        if not establishment:
            return ApiResponse(
                data=None,
            )

        data = EstablishmentSchema.from_entity(establishment)
        diia_url = "https://api.spending.gov.ua/api/v2/disposers/acts"
        diia_params = {"contractorId": establishment.edrpou}
        
        
        diia_city_response = req.get(diia_url, params=diia_params)
        diia_city_response.raise_for_status()
        
        diia_payload = diia_city_response.json()
        
        if diia_payload.get("count", 0) == 0:
            return ApiResponse(
                data={"123": 123},
            )
        
        diia_city_data = diia_payload.get("documents", [])
        
        spending_gov_ua_url = "https://city-backend.diia.gov.ua/api/front/registry/resident"
        spending_gow_ua_params = {"kw": establishment.edrpou}
        spending_gov_ua_response = req.get(spending_gov_ua_url, params=spending_gow_ua_params)
        spending_gov_ua_response.raise_for_status()
        spending_gov_ua_payload = spending_gov_ua_response.json()
        spending_gov_ua_data = spending_gov_ua_payload.get("data", [])
        
        data = {
            "establishment": data,
            "diia_city": diia_city_data,
            "spending_gov_ua": spending_gov_ua_data
        }
        
        return ApiResponse(
            data=data,
        )

    @route.post(
        "/",
        response=ApiResponse[EstablishmentSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def create_establishment(
        self,
        request: HttpRequest,
        payload: EstablishmentCreateSchema,
    ) -> ApiResponse[dict]:
        try:
            user = request.user
            
            diia_url = "https://api.spending.gov.ua/api/v2/disposers/acts"
            diia_params = {"contractorId": payload.edrpou}
            
            
            diia_city_response = req.get(diia_url, params=diia_params)
            diia_city_response.raise_for_status()
            
            diia_payload = diia_city_response.json()
            
            if diia_payload.get("count", 0) == 0:
                return ApiResponse(
                    data={"123": 123},
                )

            establishment = self.establishment_service.create_establishment(
                user=user,
                establishment_data=payload.dict(),
            )

            data = EstablishmentSchema.from_entity(establishment)

            return ApiResponse(
                data=data
                # data={
                    
                    # "777": 777
                    # },
            )
        except Exception as e:
            print(e)
            print("*" * 100)
            

    @route.put(
        "/{establishment_id}",
        response=ApiResponse[EstablishmentSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def update_establishment(
        self,
        request: HttpRequest,
        establishment_id: int,
        payload: EstablishmentUpdateSchema,
    ) -> ApiResponse[EstablishmentSchema]:
        establishment = self.establishment_service.update_establishment(
            establishment_id=establishment_id,
            establishment_data=payload.dict(),
        )

        data = EstablishmentSchema.from_entity(establishment)

        return ApiResponse(
            data=data,
        )

    @route.delete(
        "/{establishment_id}",
        response=ApiResponse[StatusOkSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def delete_establishment(
        self,
        request: HttpRequest,
        establishment_id: int,
    ) -> ApiResponse[StatusOkSchema]:
        is_establishment_deleted = self.establishment_service.delete_establishment(
            establishment_id=establishment_id,
        )

        return ApiResponse(data=StatusOkSchema(status=is_establishment_deleted))

    @route.get(
        "/{establishment_id}/activate",
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def activate_establishment(
        self,
        request: HttpRequest,
        establishment_id: int,
    ) -> ApiResponse[StatusOkSchema]:
        establishment = self.establishment_service.activate_establishment(
            establishment_id=establishment_id,
        )

        return ApiResponse(
            data=StatusOkSchema(
                    status=establishment,
                ),
        )
        
    @route.get(
        "/{establishment_id}/activate_form",
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def activate_establishment_form(
        self,
        request: HttpRequest,
        establishment_id: int,
    ) -> ApiResponse[StatusOkSchema]:
        establishment = self.establishment_service.true_activate_establishment(
            establishment_id=establishment_id,
        )

        return ApiResponse(
            data=StatusOkSchema(
                    status=establishment,
                ),
        )
    
    @route.post(
        "/{establishment_id}/photos/upload",
        response=ApiResponse[EstablishmentSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def upload_establishment_photos(
        self,
        request: HttpRequest,
        establishment_id: int,
        photos: List[UploadedFile] = File(...),
    ) -> ApiResponse[EstablishmentSchema]:
        self.establishment_photo_service.create_photos(
            establishment_id=establishment_id,
            photo_files=photos,
        )

        establishment = self.establishment_service.get_establishment_by_id(establishment_id)

        data = EstablishmentSchema.from_entity(establishment)

        return ApiResponse(
            data=data,
        )

    @route.delete(
        "/{establishment_id}/photos/{photo_id}",
        response=ApiResponse[StatusOkSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def delete_establishment_photo(
        self,
        request: HttpRequest,
        establishment_id: int,
        photo_id: int,
    ) -> ApiResponse[StatusOkSchema]:
        is_photo_deleted = self.establishment_photo_service.delete_photo(
            photo_id=photo_id,
        )

        return ApiResponse(
            data=StatusOkSchema(
                status=is_photo_deleted,
            ),
        )

    @route.get(
        "/{establishment_id}/comments",
        response=ApiResponse[List[CommentSchema]],
        auth=NOT_SET,
        permissions=[permissions.AllowAny],
    )
    def get_establishment_comments(
        self,
        request: HttpRequest,
        establishment_id: int,
    ) -> ApiResponse[List[CommentSchema]]:
        comments = self.establishment_comment_service.get_comments(
            establishment_id=establishment_id,
        )

        data = [CommentSchema.from_entity(comment) for comment in comments]

        return ApiResponse(
            data=data,
        )

    @route.post(
        "/{establishment_id}/comments/like",
        response=ApiResponse[CommentLikeSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def like_comment(
        self,
        request: HttpRequest,
        establishment_id: int,
        comment_id: int,
    ) -> ApiResponse[CommentLikeSchema]:
        user = request.user

        comment_like = self.establishment_comment_service.like_comment(
            comment_id=comment_id,
            user=user,
        )

        data = CommentLikeSchema.from_entity(comment_like)

        return ApiResponse(
            data=data,
        )

    @route.delete(
        "/{establishment_id}/comments/like",
        response=ApiResponse[StatusOkSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def unlike_comment(
        self,
        request: HttpRequest,
        establishment_id: int,
        comment_id: int,
    ) -> ApiResponse[StatusOkSchema]:
        user = request.user

        self.establishment_comment_service.unlike_comment(
            comment_id=comment_id,
            user=user,
        )

        return ApiResponse(
            data=StatusOkSchema(status=True),
        )

    @route.post(
        "/{establishment_id}/comments",
        response=ApiResponse[CommentSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def create_comment(
        self,
        request: HttpRequest,
        establishment_id: int,
        payload: CommentCreateSchema,
        images: List[UploadedFile] = File(...),
    ) -> ApiResponse[CommentSchema]:
        user = request.user

        comment = self.establishment_comment_service.create_comment(
            establishment_id=establishment_id,
            user=user,
            comment=payload.comment,
            rating=payload.rating,
            images=images,
        )

        data = CommentSchema.from_entity(comment)

        return ApiResponse(
            data=data,
        )

    @route.delete(
        "/{establishment_id}/comments/{comment_id}",
        response=ApiResponse[StatusOkSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def delete_comment(
        self,
        request: HttpRequest,
        establishment_id: int,
        comment_id: int,
    ) -> ApiResponse[StatusOkSchema]:
        user = request.user

        self.establishment_comment_service.delete_comment(
            comment_id=comment_id,
            user=user,
        )

        return ApiResponse(
            data=StatusOkSchema(status=True),
        )

    @route.delete(
        "/{establishment_id}/comments/{comment_id}/images/{image_id}",
        response=ApiResponse[StatusOkSchema],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def delete_comment_image(
        self,
        request: HttpRequest,
        establishment_id: int,
        comment_id: int,
        image_id: int,
    ) -> ApiResponse[StatusOkSchema]:
        self.establishment_comment_service.delete_comment_image(
            comment_id=comment_id,
            image_id=image_id,
        )

        return ApiResponse(
            data=StatusOkSchema(status=True),
        )

    @route.get(
        "/comments/list",
        response=ApiResponse[List[CommentSchema]],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def get_comments(
        self,
        request: HttpRequest,
        by_me: bool = Query(False),
        establishment_id: int = Query(None),
        user_id: int = Query(None),
    ) -> ApiResponse[List[CommentSchema]]:
        if by_me:
            user_id = request.user.id
        else:
            user_id = None
            
        comments = self.establishment_comment_service.get_comments(
            establishment_id=establishment_id,
            user_id=user_id,
        )
        
        data = [CommentSchema.from_entity(comment) for comment in comments]

        return ApiResponse(
            data=data,
        )
        
    @route.get(
        "/diia_city/{code_edrpou}",
        response=ApiResponse[dict],
        auth=None,
        permissions=[permissions.AllowAny],
    )
    def diia_city(
        self,
        request: HttpRequest,
        code_edrpou: str,
    ) -> ApiResponse[dict]:
        data = fetch_residents(
            keyword=code_edrpou,
        )
        
        return ApiResponse(
            data={
                "data": data,
                },
        )

    @route.get(
        "/spending/{establishment_id}",
        response=ApiResponse[dict],
        auth=JWTAuth(),
        permissions=[permissions.IsAuthenticated],
    )
    def spending(
        self,
        request: HttpRequest,
        establishment_id: int,
    ) -> ApiResponse[dict]:
        establishment = self.establishment_service.get_establishment_by_id(establishment_id)
        if not establishment:
            return ApiResponse(data=None)
            
        spending_gov_ua_url = "https://city-backend.diia.gov.ua/api/front/registry/resident"
        spending_gow_ua_params = {"kw": establishment.edrpou}
        spending_gov_ua_response = req.get(spending_gov_ua_url, params=spending_gow_ua_params)
        spending_gov_ua_response.raise_for_status()
        spending_gov_ua_payload = spending_gov_ua_response.json()
        spending_gov_ua_data = spending_gov_ua_payload.get("data", [])
        
        payload = {
            "records": [spending_gov_ua_data],  
            "establishment": establishment.__dict__
        }

        estimate_response = req.post(
            url=f"{settings.FASTAPI_HOST_PORT}/estimate",
            json=payload,
            timeout=10,
        )
        estimate_response.raise_for_status()
        response_payload = estimate_response.json()
        return ApiResponse(data=response_payload)