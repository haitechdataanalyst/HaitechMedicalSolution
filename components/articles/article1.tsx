import { ReactNode } from 'react';

export interface ArticleData {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: ReactNode;
  publishedAt: string;
  author: string;
  readTime: string;
  imageSrc?: string;
  imageAlt?: string;
  publishedTime?: string;
  views?: number;
}

export const article1: ArticleData = {
  id: 1,
  title: "How to Prepare for a Demo with Haitech Medical",
  slug: "how-to-prepare-for-a-demo-with-haitech-medical",
  category: "Loupes",
  excerpt: "At Haitech Medical, we want your demo experience to be as smooth, productive, and enjoyable as possible. Whether you're exploring new dental loupes or updating your current setup, this guide will help you know what to expect – and how to get the most out of your visit.",
  content: (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">What to Expect</h2>
      <ol className="list-decimal list-inside space-y-3 mb-6 text-gray-700 leading-relaxed">
        <li><strong className="text-gray-900">Timeframe:</strong> Your demo session will take around 30-60 minutes, depending on your needs. During this time, we'll discuss your current setup, challenges, and preferences so we can tailor our recommendations to your workflow.</li>
        <li><strong className="text-gray-900">Hands-On Experience:</strong> You'll have the chance to try out the latest loupe designs and features. Our experts will walk you through the options, helping you compare styles, magnifications, and ergonomic fits. We'll also take precise measurements to ensure your loupes are customised perfectly for comfort and performance.</li>
        <li><strong className="text-gray-900">Personalized Service:</strong> At Haitech Medical, we pride ourselves on offering personalized, one-on-one guidance. Our goal is to help you find the right tools to improve visibility, posture, and efficiency – so you can focus on what you do best.</li>
      </ol>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What to Prepare</h2>
      <p className="text-gray-700 leading-relaxed mb-4">A little preparation goes a long way toward making your demo as effective as possible. Here's what we recommend:</p>
      <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700 leading-relaxed">
        <li><strong className="text-gray-900">Bring Your Old Loupes (if you have them):</strong> Having your current loupes on hand helps us compare sizing, magnification, and fit — and identify what can be improved.</li>
        <li><strong className="text-gray-900">Set Up a Dental Chair (if possible):</strong> If you can, have a volunteer sit in your chair during the session. This allows us to take accurate working-distance measurements that reflect real-world use.</li>
        <li><strong className="text-gray-900">Have a Script Ready (Optional):</strong> If you have a preferred demonstration or treatment sequence, feel free to prepare a short script. This helps us evaluate how the loupes perform during your actual workflow.</li>
        <li><strong className="text-gray-900">Minimize Distractions:</strong> Try to allow for uninterrupted time during the session. This ensures a smooth, focused visit — and helps us make the most of your demo.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Commitment to You</h2>
      <p className="text-gray-700 leading-relaxed mb-4">From start to finish, our team is here to guide you through every step of the process. We're committed to providing expert advice, quality products, and exceptional aftercare. Your comfort, precision, and satisfaction are always our top priorities.</p>
    </>
  ),
  publishedAt: "2025-10-30",
  author: "Tom Mittelman",
  readTime: "5 min read",
  publishedTime: "01:53pm",
  views: 80,
};