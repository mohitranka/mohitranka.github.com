/**
 * Contact form backend config (Web3Forms).
 *
 * Setup (free, ~2 minutes):
 * 1. Open https://web3forms.com/ and create an access key for your inbox
 * 2. Confirm the email they send you
 * 3. Paste the access key below
 *
 * Free plan: 250 submissions/month. Docs: https://docs.web3forms.com/
 * The access key is a public client key (safe to ship in the browser).
 */
window.SITE_CONTACT = {
  provider: "web3forms",
  /** Required — Web3Forms access key */
  accessKey: "0440d15e-0be8-454c-9b18-81f205f58cd9",
  /** Subject line prefix in the email you receive */
  subjectPrefix: "mohitranka.com contact",
  /** Optional: from name shown in Web3Forms emails */
  fromName: "mohitranka.com",
};
