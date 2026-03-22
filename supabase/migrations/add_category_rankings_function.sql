CREATE OR REPLACE FUNCTION get_category_rankings(since_date timestamptz, result_limit integer)
RETURNS TABLE (
  category_name text,
  view_count bigint,
  lure_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    lc.category_name_ja::text as category_name,
    COUNT(pv.id) as view_count,
    COUNT(DISTINCT l.id) as lure_count
  FROM page_views pv
  JOIN lures l ON l.id = pv.lure_id
  JOIN lure_categories lc ON lc.id = l.lure_category_id
  WHERE pv.viewed_at >= since_date
    AND l.is_available = true
    AND lc.is_visible = true
  GROUP BY lc.category_name_ja
  ORDER BY view_count DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
