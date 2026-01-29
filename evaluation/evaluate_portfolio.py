"""
Neural Flux Portfolio - Evaluation Framework

Comprehensive evaluation suite for performance metrics, bundle optimization,
loading experience, and UX interaction quality.
"""

import json
import os
from pathlib import Path
from typing import Dict, Any
from dataclasses import dataclass
import pandas as pd

# Azure AI Evaluation imports
try:
    from azure.ai.evaluation import evaluate
    HAS_AZURE_EVAL = True
except ImportError:
    HAS_AZURE_EVAL = False
    print("Warning: azure-ai-evaluation not installed. Run: pip install azure-ai-evaluation")


@dataclass
class EvaluationResult:
    """Container for evaluation result"""
    query_id: str
    scenario: str
    metric: str
    value: Any
    status: str
    notes: str = ""


class PerformanceMetricsEvaluator:
    """Evaluates Lighthouse and Core Web Vitals scores"""
    
    def __init__(self):
        self.target_lighthouse = 94
        self.target_lcp_ms = 2500
        self.target_fid_ms = 100
        self.target_cls = 0.1
    
    def __call__(self, *, query_id: str, scenario: str, response: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """
        Evaluate performance metrics from response data
        
        Args:
            query_id: Query identifier
            scenario: Test scenario name
            response: Response data containing scores or metrics
            
        Returns:
            Dictionary with evaluation results
        """
        if "metric" in response:
            # Core Web Vitals evaluation
            metric = response.get("metric")
            if metric == "LCP":
                value = response.get("value_ms", 0)
                passed = value <= self.target_lcp_ms
                return {
                    "query_id": query_id,
                    "metric_name": "LCP",
                    "value_ms": value,
                    "target_ms": self.target_lcp_ms,
                    "passed": passed,
                    "score": 1.0 if passed else max(0, 1 - (value - self.target_lcp_ms) / 5000)
                }
            elif metric == "FID":
                value = response.get("value_ms", 0)
                passed = value <= self.target_fid_ms
                return {
                    "query_id": query_id,
                    "metric_name": "FID",
                    "value_ms": value,
                    "target_ms": self.target_fid_ms,
                    "passed": passed,
                    "score": 1.0 if passed else max(0, 1 - (value - self.target_fid_ms) / 200)
                }
            elif metric == "CLS":
                value = response.get("value", 0)
                passed = value <= self.target_cls
                return {
                    "query_id": query_id,
                    "metric_name": "CLS",
                    "value": value,
                    "target": self.target_cls,
                    "passed": passed,
                    "score": 1.0 if passed else max(0, 1 - (value - self.target_cls) / 0.2)
                }
        
        # Lighthouse score evaluation
        scores = response.get("scores", {})
        if scores:
            all_passed = all(score >= self.target_lighthouse for score in scores.values())
            avg_score = sum(scores.values()) / len(scores) if scores else 0
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "scores": scores,
                "all_passed": all_passed,
                "average_score": round(avg_score, 2),
                "meets_target_95": avg_score >= 95
            }
        
        return {"query_id": query_id, "status": "error", "message": "No metrics found in response"}


class BundleOptimizationEvaluator:
    """Evaluates bundle chunk sizes and code splitting"""
    
    def __init__(self):
        self.max_main_size_kb = 50
        self.max_three_size_kb = 700
        self.target_three_core_separation = True
    
    def __call__(self, *, query_id: str, scenario: str, response: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """
        Evaluate bundle optimization metrics
        
        Args:
            query_id: Query identifier
            scenario: Test scenario name
            response: Response containing chunk data
            
        Returns:
            Dictionary with bundle optimization scores
        """
        chunks_verified = response.get("chunks_verified", False)
        chunk_details = response.get("chunk_details", {})
        optimization_status = response.get("bundle_metrics", {}).get("optimization_status", {})
        
        if not chunks_verified:
            return {
                "query_id": query_id,
                "scenario": scenario,
                "status": "error",
                "message": "Chunks not properly verified"
            }
        
        # Analyze chunk sizes
        main_chunk_size = sum(
            chunk["size_kb"] for name, chunk in chunk_details.items()
            if "index" in name and ".js" in name
        )
        
        three_core_size = sum(
            chunk["size_kb"] for name, chunk in chunk_details.items()
            if "three-core" in name
        )
        
        # Evaluate bundle health
        properly_split = optimization_status.get("properly_split", False)
        has_all_chunks = all([
            optimization_status.get("has_three_core_chunk", False),
            optimization_status.get("has_r3f_vendor_chunk", False),
            optimization_status.get("has_motion_vendor_chunk", False),
            optimization_status.get("has_scroll_vendor_chunk", False)
        ])
        
        main_size_ok = main_chunk_size <= self.max_main_size_kb
        three_size_ok = three_core_size <= self.max_three_size_kb
        
        return {
            "query_id": query_id,
            "scenario": scenario,
            "properly_split": properly_split,
            "has_all_required_chunks": has_all_chunks,
            "main_chunk_size_kb": round(main_chunk_size, 2),
            "main_size_ok": main_size_ok,
            "three_core_size_kb": round(three_core_size, 2),
            "three_size_ok": three_size_ok,
            "overall_score": 1.0 if (properly_split and has_all_chunks and main_size_ok and three_size_ok) else 0.5,
            "optimization_quality": "excellent" if properly_split and has_all_chunks else "needs_improvement"
        }


class LoadingExperienceEvaluator:
    """Evaluates loading state, NeuralLoader, and initialization"""
    
    def __init__(self):
        self.target_lenis_init_ms = 200
        self.target_load_time_ms = 5000
    
    def __call__(self, *, query_id: str, scenario: str, response: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """
        Evaluate loading experience metrics
        
        Args:
            query_id: Query identifier
            scenario: Test scenario name
            response: Response containing loading data
            
        Returns:
            Dictionary with loading experience scores
        """
        # NeuralLoader visibility
        if "neural_loader_displayed" in response:
            displayed = response.get("neural_loader_displayed", False)
            display_time = response.get("display_time_ms", 0)
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "neural_loader_displayed": displayed,
                "display_time_ms": display_time,
                "loader_working": displayed,
                "ux_quality": "good" if displayed and display_time < 200 else "acceptable"
            }
        
        # 3D asset loading progress
        if "progress_reached" in response:
            progress = response.get("progress_reached", 0)
            load_time = response.get("load_time_ms", 0)
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "progress_reached": progress,
                "progress_complete": progress == 100,
                "load_time_ms": load_time,
                "useProgress_works": progress == 100
            }
        
        # Lenis initialization
        if "lenis_ready_ms" in response:
            lenis_time = response.get("lenis_ready_ms", 0)
            target = self.target_lenis_init_ms
            fouc_prevented = response.get("fouc_prevented", False)
            
            meets_target = lenis_time <= target
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "lenis_init_ms": lenis_time,
                "target_ms": target,
                "meets_target": meets_target,
                "fouc_prevented": fouc_prevented,
                "initialization_quality": "excellent" if meets_target and fouc_prevented else "good",
                "score": 1.0 if (meets_target and fouc_prevented) else 0.8
            }
        
        # Content visibility
        if "content_visible" in response:
            visible = response.get("content_visible", False)
            visibility_time = response.get("visibility_time_ms", 0)
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "content_visible": visible,
                "visibility_time_ms": visibility_time,
                "content_loading_works": visible
            }
        
        return {"query_id": query_id, "status": "error", "message": "Unknown loading response format"}


class UXInteractionEvaluator:
    """Evaluates UX interactions: cursor stickiness, fade effects, SEO titles"""
    
    def __call__(self, *, query_id: str, scenario: str, response: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """
        Evaluate UX interaction quality
        
        Args:
            query_id: Query identifier
            scenario: Test scenario name
            response: Response containing UX data
            
        Returns:
            Dictionary with UX interaction scores
        """
        # Cursor stickiness
        if "cursor_stickiness_active" in response:
            stickiness = response.get("cursor_stickiness_active", False)
            magnetic = response.get("magnetic_effect_detected", False)
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "stickiness_active": stickiness,
                "magnetic_effect": magnetic,
                "cursor_wow_factor": stickiness and magnetic,
                "quality": "excellent" if stickiness and magnetic else "needs_work"
            }
        
        # Cursor fade on boundary
        if "cursor_fade_on_leave" in response:
            fade_works = response.get("cursor_fade_on_leave", False)
            final_opacity = response.get("final_opacity", 1)
            fade_smooth = response.get("fade_works_correctly", False)
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "fade_on_leave_works": fade_works,
                "final_opacity": final_opacity,
                "fade_smooth": fade_smooth,
                "boundary_ux": "polished" if fade_works and final_opacity == 0 else "basic"
            }
        
        # Dynamic SEO titles
        if "helmet_provider_active" in response:
            helmet_active = response.get("helmet_provider_active", False)
            titles_updated = response.get("dynamic_titles_updated", False)
            title_count = response.get("title_updates_detected", 0)
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "helmet_active": helmet_active,
                "dynamic_titles": titles_updated,
                "title_updates_count": title_count,
                "seo_implementation": "complete" if helmet_active and titles_updated else "incomplete",
                "score": 1.0 if (helmet_active and titles_updated and title_count == 6) else 0.7
            }
        
        # Section tracking
        if "section_tracking_works" in response:
            tracking = response.get("section_tracking_works", False)
            positions_tracked = response.get("scroll_positions_tracked", 0)
            updates = response.get("active_section_updates", 0)
            
            return {
                "query_id": query_id,
                "scenario": scenario,
                "tracking_works": tracking,
                "positions_tracked": positions_tracked,
                "section_updates": updates,
                "navigation_ux": "responsive" if tracking else "static"
            }
        
        return {"query_id": query_id, "status": "error", "message": "Unknown UX response format"}


class PortfolioEvaluationSuite:
    """Main evaluation suite orchestrating all evaluators"""
    
    def __init__(self):
        self.evaluators = {
            "performance": PerformanceMetricsEvaluator(),
            "bundle": BundleOptimizationEvaluator(),
            "loading": LoadingExperienceEvaluator(),
            "ux": UXInteractionEvaluator()
        }
        self.results = []
    
    def load_data(self, queries_file: str, responses_file: str) -> tuple:
        """Load queries and responses from JSON files"""
        with open(queries_file, 'r') as f:
            queries = json.load(f)
        
        with open(responses_file, 'r') as f:
            responses = json.load(f)
        
        return queries, responses
    
    def run_evaluation(self, queries_file: str = "evaluation/queries.json", 
                      responses_file: str = "evaluation/responses.json") -> Dict[str, Any]:
        """Execute full evaluation suite"""
        print("🚀 Starting Neural Flux Portfolio Evaluation...\n")
        
        queries, responses = self.load_data(queries_file, responses_file)
        
        # Build response lookup
        response_map = {r["query_id"]: r for r in responses}
        
        # Categorize queries and run evaluations
        for query in queries:
            query_id = query["id"]
            response = response_map.get(query_id, {})
            response_data = response.get("response", {})
            
            test_type = query.get("test_type", "unknown")
            scenario = query.get("scenario", "Unknown Scenario")
            
            # Route to appropriate evaluator
            if test_type == "performance":
                evaluator = self.evaluators["performance"]
                metric_type = "Performance"
            elif test_type == "bundle_optimization":
                evaluator = self.evaluators["bundle"]
                metric_type = "Bundle"
            elif test_type == "loading_experience":
                evaluator = self.evaluators["loading"]
                metric_type = "Loading"
            elif test_type == "ux_interaction":
                evaluator = self.evaluators["ux"]
                metric_type = "UX"
            else:
                continue
            
            try:
                result = evaluator(
                    query_id=query_id,
                    scenario=scenario,
                    response=response_data
                )
                
                self.results.append({
                    "query_id": query_id,
                    "scenario": scenario,
                    "metric_type": metric_type,
                    "result": result,
                    "status": "success"
                })
                
                print(f"✓ {metric_type:12} | {scenario[:50]:<50}")
            except Exception as e:
                self.results.append({
                    "query_id": query_id,
                    "scenario": scenario,
                    "metric_type": metric_type,
                    "error": str(e),
                    "status": "error"
                })
                print(f"✗ {metric_type:12} | {scenario[:50]:<50} - Error: {e}")
        
        return self._generate_report()
    
    def _generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive evaluation report"""
        print("\n" + "="*80)
        print("📊 NEURAL FLUX PORTFOLIO EVALUATION REPORT")
        print("="*80 + "\n")
        
        # Separate results by metric type
        metrics_by_type = {}
        for result in self.results:
            metric_type = result.get("metric_type", "Unknown")
            if metric_type not in metrics_by_type:
                metrics_by_type[metric_type] = []
            metrics_by_type[metric_type].append(result)
        
        # Performance metrics report
        if "Performance" in metrics_by_type:
            self._report_performance_metrics(metrics_by_type["Performance"])
        
        # Bundle optimization report
        if "Bundle" in metrics_by_type:
            self._report_bundle_metrics(metrics_by_type["Bundle"])
        
        # Loading experience report
        if "Loading" in metrics_by_type:
            self._report_loading_metrics(metrics_by_type["Loading"])
        
        # UX interaction report
        if "UX" in metrics_by_type:
            self._report_ux_metrics(metrics_by_type["UX"])
        
        print("="*80 + "\n")
        
        return {
            "total_tests": len(self.results),
            "passed": sum(1 for r in self.results if r.get("status") == "success"),
            "failed": sum(1 for r in self.results if r.get("status") == "error"),
            "results_by_type": metrics_by_type,
            "all_results": self.results
        }
    
    def _report_performance_metrics(self, results: list):
        """Report performance metrics"""
        print("🎯 PERFORMANCE METRICS")
        print("-" * 80)
        
        for result in results:
            if result["status"] == "success":
                res = result["result"]
                if "average_score" in res:
                    score = res.get("average_score", 0)
                    meets = "✓" if res.get("meets_target_95", False) else "✗"
                    print(f"  {meets} Lighthouse Score: {score}/100 (Target: 95+)")
                    print(f"     Scores: {res['scores']}")
                else:
                    metric = res.get("metric_name", "Unknown")
                    value = res.get("value_ms") or res.get("value", "N/A")
                    target = res.get("target_ms") or res.get("target", "N/A")
                    passed = "✓" if res.get("passed", False) else "✗"
                    print(f"  {passed} {metric}: {value} (Target: {target})")
        print()
    
    def _report_bundle_metrics(self, results: list):
        """Report bundle optimization metrics"""
        print("📦 BUNDLE OPTIMIZATION")
        print("-" * 80)
        
        for result in results:
            if result["status"] == "success":
                res = result["result"]
                properly_split = res.get("properly_split", False)
                quality = res.get("optimization_quality", "unknown")
                print(f"  Chunks Properly Split: {'✓' if properly_split else '✗'}")
                print(f"  Main Chunk Size: {res.get('main_chunk_size_kb', 'N/A')} KB")
                print(f"  Three Core Size: {res.get('three_core_size_kb', 'N/A')} KB")
                print(f"  Quality: {quality}")
        print()
    
    def _report_loading_metrics(self, results: list):
        """Report loading experience metrics"""
        print("⚡ LOADING EXPERIENCE")
        print("-" * 80)
        
        for result in results:
            if result["status"] == "success":
                res = result["result"]
                scenario = result["scenario"]
                
                if "neural_loader_displayed" in res:
                    print(f"  ✓ NeuralLoader: {'Displayed' if res.get('neural_loader_displayed') else 'Hidden'}")
                elif "progress_reached" in res:
                    progress = res.get('progress_reached', 0)
                    is_complete = res.get('progress_complete', False)
                    status = "100% loaded" if is_complete else f"{progress}% loaded"
                    print(f"  ✓ 3D Assets: {status}")
                elif "lenis_init_ms" in res:
                    meets = "✓" if res.get("meets_target") else "✗"
                    print(f"  {meets} Lenis Init: {res.get('lenis_init_ms')}ms (Target: {res.get('target_ms')}ms)")
                elif "content_visible" in res:
                    print(f"  ✓ Content Visible: {res.get('visibility_time_ms')}ms")
        print()
    
    def _report_ux_metrics(self, results: list):
        """Report UX interaction metrics"""
        print("✨ UX INTERACTION QUALITY")
        print("-" * 80)
        
        for result in results:
            if result["status"] == "success":
                res = result["result"]
                scenario = result["scenario"]
                
                if "stickiness_active" in res:
                    print(f"  {'✓' if res.get('cursor_wow_factor') else '✗'} Magnetic Cursor: {res.get('quality')}")
                elif "fade_on_leave" in res:
                    print(f"  {'✓' if res.get('fade_smooth') else '✗'} Cursor Boundary Fade: {res.get('boundary_ux')}")
                elif "helmet_active" in res:
                    print(f"  {'✓' if res.get('dynamic_titles') else '✗'} Dynamic SEO Titles: {res.get('seo_implementation')}")
                elif "section_tracking_works" in res:
                    print(f"  {'✓' if res.get('tracking_works') else '✗'} Navigation Tracking: {res.get('navigation_ux')}")
        print()
    
    def save_report(self, output_file: str = "evaluation/report.json") -> str:
        """Save evaluation report to JSON"""
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        report = self._generate_report()
        
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"📄 Report saved to: {output_path}\n")
        return str(output_path)


if __name__ == "__main__":
    suite = PortfolioEvaluationSuite()
    report = suite.run_evaluation()
    suite.save_report()
