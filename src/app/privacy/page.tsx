import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-charcoal tracking-tight">
            tasu
          </span>
          <span className="text-xs text-warm-gray">.ai</span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-charcoal hover:text-terracotta transition-colors"
        >
          Sign in
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-warm-gray mb-8">
          Last updated: March 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-charcoal/80">
          <section>
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              What we collect
            </h2>
            <p className="text-sm leading-relaxed">
              When you sign up for Tasu, we collect your email address and the
              business context you provide (website URL, business description).
              Chat messages between you and Tasu are stored to maintain
              conversation history.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              How we use your data
            </h2>
            <p className="text-sm leading-relaxed">
              Your business context and chat history are used solely to provide
              you with personalized AI co-founder advice. We send your messages
              to Anthropic&apos;s Claude API to generate responses. We do not
              sell your data or use it for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              Data storage
            </h2>
            <p className="text-sm leading-relaxed">
              Your data is stored securely using Supabase with row-level
              security enabled. Only you can access your own data. We use
              industry-standard encryption for data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              Third-party services
            </h2>
            <p className="text-sm leading-relaxed">
              We use Supabase for authentication and data storage, and
              Anthropic&apos;s Claude API for AI responses. Each service has
              their own privacy policies. We recommend reviewing them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              Your rights
            </h2>
            <p className="text-sm leading-relaxed">
              You can delete your account and all associated data at any time.
              You can export your data. You can update your business context in
              Settings. Contact us at privacy@tasu.ai for any privacy-related
              requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-charcoal mb-2">
              Contact
            </h2>
            <p className="text-sm leading-relaxed">
              If you have any questions about this privacy policy, please
              contact us at privacy@tasu.ai.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
