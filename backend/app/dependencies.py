from __future__ import annotations

from fastapi import Request

from app.services.platform import PlatformService


def get_platform_service(request: Request) -> PlatformService:
    return request.app.state.platform_service
