"""
Neural Flux Portfolio Evaluation Framework

Comprehensive evaluation suite for measuring performance, bundle optimization,
loading experience, and UX interaction quality.

Usage:
    python evaluation/collect_responses.py  # Collect response data
    python evaluation/evaluate_portfolio.py # Run evaluation
"""

__version__ = "1.0.0"
__title__ = "Neural Flux Evaluation Framework"

from .collect_responses import PortfolioResponseCollector
from .evaluate_portfolio import (
    PortfolioEvaluationSuite,
    PerformanceMetricsEvaluator,
    BundleOptimizationEvaluator,
    LoadingExperienceEvaluator,
    UXInteractionEvaluator,
)

__all__ = [
    "PortfolioResponseCollector",
    "PortfolioEvaluationSuite",
    "PerformanceMetricsEvaluator",
    "BundleOptimizationEvaluator",
    "LoadingExperienceEvaluator",
    "UXInteractionEvaluator",
]
