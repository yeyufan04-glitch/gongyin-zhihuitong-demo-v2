export function getReviewRoute({ keyRuleConflict = false, missingDocuments = false, lowModelConfidence = false, semanticReviewOnly = false } = {}) {
  if (keyRuleConflict || lowModelConfidence) return "FULL_REVIEW";
  if (missingDocuments) return "SUPPLEMENT_REQUIRED";
  if (semanticReviewOnly) return "FOCUSED_REVIEW";
  return "FAST_REVIEW";
}
