"""
Production background pipeline sketch.
Intentionally not connected to live sources in this offline package.
"""

def fetch_source(source):
    """Use RSS/API/source adapter according to each source's terms."""
    raise NotImplementedError

def normalize(article):
    return {
        "external_id": article.get("id"),
        "title": article.get("title"),
        "url": article.get("url"),
        "published_at": article.get("published_at"),
        "raw_text": article.get("text"),
    }

def cluster_story(items):
    """Semantic/title similarity + source/time-window logic."""
    raise NotImplementedError

def verify_story(cluster):
    """
    Suggested states:
    Official / Confirmed
    Multiple Sources
    Single Source
    Rumor / Unverified
    """
    raise NotImplementedError

def prioritize_story(cluster, scope):
    """
    Football boosts: FC Barcelona, Georgian Legionnaires.
    Logistics boosts: Middle Corridor, Black Sea, Port Industry.
    """
    raise NotImplementedError

def summarize_story(cluster):
    """Server-side AI call; never expose provider keys in browser."""
    raise NotImplementedError
