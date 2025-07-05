from pydantic import BaseModel
from typing import Optional


class FileMetadata(BaseModel):
    title: str
    description: str
    tags: list[str]
    access_group: str
    category: str
    link: Optional[str] = None
    contact: str


    def __init__(self, title: str, description: str, tags: list[str], access_group: str, category: str, link: str, contact: str):
        super().__init__(
            title=title,
            description=description,
            tags=tags,
            access_group=access_group,
            category=category,
            link=link,
            contact=contact
        )

