/**
 * Transforms sandbox analysis data to the format expected by export generators
 */
export function transformSandboxDataForExport(sandboxData: any, patentTitle: string) {
  return {
    title: patentTitle,
    query_text: `Patent analysis for: ${patentTitle}`,
    analysis_results: {
      executive_summary: `This report analyzes the patent landscape for "${patentTitle}" based on feature-driven architecture analysis. The structured approach evaluates novelty and technical positioning across multiple dimensions.`,
      overview: `Comprehensive analysis of a technical system implementing ${patentTitle} with detailed feature breakdown and strategic assessment.`,
      patent_search_queries: [
        `"${patentTitle}" OR similar patents`,
        'Patent landscape analysis for disclosed technology'
      ],
      extracted_concepts: sandboxData?.features?.map((f: any) => f.name) || [],
      overlapping_concepts: sandboxData?.features?.slice(0, 3).map((f: any) => f.name.toLowerCase()) || [],
      matches: [], // Sandbox doesn't have real matches
      similarity_analysis_summary: {
        high: 0,
        medium: 0,
        low: 0
      },
      risk_assessment: `Based on the feature composition and novelty score of ${sandboxData?.noveltyScore || 0}%, the invention presents a ${
        (sandboxData?.noveltyScore || 0) > 75 ? 'strong' : (sandboxData?.noveltyScore || 0) > 50 ? 'moderate' : 'limited'
      } innovation profile.`,
      recommendation: {
        action: sandboxData?.noveltyScore > 75 ? 'PROCEED' : sandboxData?.noveltyScore > 50 ? 'REFINE' : 'CAUTION',
        reason: `Novelty assessment: ${sandboxData?.noveltyScore || 0}% confidence level.`,
        suggested_action: `Continue with ${sandboxData?.noveltyScore > 50 ? 'development' : 'refinement'} of the proposed technical architecture.`
      },
      // Include original sandbox data for reference
      features: sandboxData?.features || [],
      noveltyScore: sandboxData?.noveltyScore || 0,
      confidence: sandboxData?.confidence || 0
    }
  };
}
