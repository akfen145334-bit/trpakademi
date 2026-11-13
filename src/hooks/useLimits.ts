import { useAuth } from '../context/AuthContext';
import { limitsFor, PAYWALL_ENABLED, TIER_LABEL } from '../config/plans';

/** Kullanıcının katmanı ve geçerli sınırları. PAYWALL_ENABLED=false iken her şey açıktır. */
export const useLimits = () => {
  const { tier } = useAuth();
  return { tier, tierLabel: TIER_LABEL[tier], limits: limitsFor(tier), paywall: PAYWALL_ENABLED };
};
