/**
 * Article bodies, transcribed from in2itebs.com (re-captured 2026-09-21 against the live pages).
 * The text is the live site's, block for block and word for word: its section headings, its bold
 * sub-headings, its inline images (under /public/insights/body) and its author photos, in the live
 * order. Only the site chrome around the article (header, footer, comment form, share bar), the
 * title, which the page header prints, and six author photos whose files the live server no longer
 * has (they 404 there too) are left out. `author`, `authorRole` and `authorDate` carry
 * the byline the article itself prints, where it has one.
 *
 * "grow-with-sap" is an event landing page on the live site rather than a written article — it
 * carries a forum title, a strapline and a "Register Now" button and nothing else, so that is all
 * there is to show. The button keeps the live site's own destination path, which
 * content/redirects.mjs resolves on this site.
 */
export type InsightBlock =
  | { type: "heading" | "paragraph" | "listItem"; text: string; strong?: boolean }
  | { type: "image"; src: string; alt?: string }
  | { type: "link"; text: string; href: string };

export const insightBodies: Record<
  string,
  { author?: string; authorRole?: string; authorDate?: string; blocks: InsightBlock[] }
> = {
  "revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions": {
    blocks: [
      {
        type: "paragraph",
        text: "In the modern business landscape, effective Human Capital Management (HCM) is essential for driving success. Organizations need to attract, retain, and develop talent while optimizing HR operations to maintain a competitive edge. SAP SuccessFactors, a leading cloud-based HCM suite, enables businesses to modernize HR functions and align them with strategic objectives. As a trusted SAP SuccessFactors Implementation Partner, In2IT Enterprise Business Services supports organizations across India, Singapore, Kenya, Dubai, UAE, the USA, and South Africa in achieving operational excellence and maximizing their workforce potential.",
      },
      {
        type: "paragraph",
        text: "The Strategic Value of SAP SuccessFactors",
        strong: true,
      },
      {
        type: "paragraph",
        text: "SAP SuccessFactors is not merely an HR tool; it is a comprehensive platform designed to address the entire employee lifecycle, from recruitment to retirement. By integrating advanced analytics, artificial intelligence, and machine learning, SAP SuccessFactors empowers organizations to make data-driven decisions, enhance employee experiences, and build a future-ready workforce. Its modular architecture allows businesses to tailor solutions to their unique needs, ensuring scalability and flexibility in an ever-changing business environment.",
      },
      {
        type: "paragraph",
        text: "Exploring the Core Modules of SAP SuccessFactors:",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Employee Central (EC): Serving as the backbone of SAP SuccessFactors, Employee Central consolidates all HR data into a single, unified system. This centralized approach ensures data accuracy, compliance, and real-time access to critical workforce insights, enabling HR leaders to make informed decisions that align with organizational goals.",
      },
      {
        type: "paragraph",
        text: "Recruitment and Onboarding: In a competitive talent market, attracting and retaining top talent is paramount. SAP SuccessFactors’ Recruitment and Onboarding modules streamline the hiring process by leveraging AI-driven candidate matching, automated workflows, and personalized onboarding experiences. This not only reduces time-to-hire but also ensures a seamless transition for new hires, fostering engagement from day one.",
      },
      {
        type: "paragraph",
        text: "Performance and Goals: Aligning individual performance with organizational objectives is essential for driving productivity and accountability. The Performance and Goals module facilitates continuous feedback, transparent goal-setting, and data-driven performance evaluations. By fostering a culture of recognition and development, organizations can enhance employee motivation and retention.",
      },
      {
        type: "paragraph",
        text: "Learning Management: In a world where skills are rapidly evolving, continuous learning is critical for organizational resilience. SAP SuccessFactors’ Learning Management module offers personalized, on-demand training programs that empower employees to upskill and adapt to changing business needs. This not only enhances individual performance but also ensures the organization remains competitive in a dynamic market.",
      },
      {
        type: "paragraph",
        text: "Compensation Management: Fair and equitable compensation is a key driver of employee satisfaction and loyalty. The Compensation Management module enables organizations to design and implement competitive pay structures that reflect performance, market trends, and organizational priorities. By aligning compensation with business outcomes, companies can attract and retain top talent while maintaining fiscal responsibility.",
      },
      {
        type: "paragraph",
        text: "Succession and Development: Leadership continuity is a critical factor in long-term organizational success. The Succession and Development module identifies high-potential employees, nurtures their leadership capabilities, and ensures readiness for key roles. By proactively addressing talent gaps, organizations can mitigate risks and maintain operational stability.",
      },
      {
        type: "paragraph",
        text: "Workforce Analytics and Planning: In an era of data-driven decision-making, actionable insights are indispensable. SAP SuccessFactors’ Workforce Analytics and Planning module provides advanced data visualization, predictive analytics, and scenario modeling capabilities. These tools enable HR leaders to anticipate workforce trends, optimize resource allocation, and align talent strategies with business objectives.",
      },
      {
        type: "paragraph",
        text: "In2IT EBS: Delivering Strategic HCM Transformation",
        strong: true,
      },
      {
        type: "paragraph",
        text: "As a seasoned SAP SuccessFactors Implementation Partner, In2IT EBS combines deep domain expertise, cutting-edge technology, and a client-centric approach to deliver transformative HCM solutions. Our global presence, spanning India, Singapore, Kenya, Dubai, UAE, the USA, and South Africa, allows us to cater to diverse organizational needs while adhering to local regulations and cultural nuances.",
      },
      {
        type: "paragraph",
        text: "Our team of certified SAP SuccessFactors consultants collaborates closely with clients to understand their unique challenges and objectives. From initial strategy development to post-implementation support, we ensure a seamless transition to SAP SuccessFactors, enabling organizations to maximize their investment and achieve measurable outcomes.",
      },
      {
        type: "paragraph",
        text: "Why Partner with In2IT EBS?",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Global Expertise: With a strong presence across multiple regions, we leverage internationally recognized best practices to deliver solutions that align with industry standards, regulatory requirements, and business objectives. Our deep understanding SAP Solutions of ensures that our offerings are not only innovative but also strategically tailored to meet the unique challenges of each market.",
      },
      {
        type: "paragraph",
        text: "End-to-End SAP Solutions: Our comprehensive service offerings encompass every stage of the implementation lifecycle, from planning and deployment to training and ongoing support. This holistic approach guarantees long-term success and sustained value.",
      },
      {
        type: "paragraph",
        text: "Proven Industry Expertise: With a track record of successful implementations across diverse industries, we possess the expertise to address complex HR challenges and deliver tailored solutions that drive business outcomes.",
      },
      {
        type: "paragraph",
        text: "Unlocking the Full Potential of SAP SuccessFactors",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Implementing SAP SuccessFactors is not just about adopting new technology; it is about redefining how organizations manage their most valuable asset—their people. In2IT EBS ensures that every implementation is aligned with the customers strategic vision, supported by robust change management and user adoption strategies. By focusing on these critical elements, we enable organizations to fully leverage the capabilities of SAP SuccessFactors and achieve transformative results.",
      },
      {
        type: "paragraph",
        text: "Driving Tangible Business Outcomes",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Through our SAP SuccessFactors implementations, organizations can realize the following benefits:",
      },
      {
        type: "paragraph",
        text: "Enhanced Employee Engagement: By delivering personalized and intuitive employee experiences, organizations can foster a culture of engagement and loyalty.",
      },
      {
        type: "paragraph",
        text: "Data-Driven Decision-Making: Access to real-time workforce insights enables HR leaders to make informed, strategic decisions that drive business growth.",
      },
      {
        type: "paragraph",
        text: "Operational Efficiency: Automation of routine HR tasks frees up resources, allowing HR teams to focus on strategic initiatives that add value.",
      },
      {
        type: "paragraph",
        text: "Future-Ready Workforce:",
      },
      {
        type: "paragraph",
        text: "By investing in employee development and succession planning, organizations can build a resilient workforce capable of navigating industry disruptions.",
      },
      {
        type: "paragraph",
        text: "The AI-Powered HR: How SAP SuccessFactors is Transforming HR Operations",
        strong: true,
      },
      {
        type: "paragraph",
        text: "HR has evolved beyond simply managing personnel to leveraging intelligent technologies that drive business success. SAP SuccessFactors, powered by AI, is transforming HR operations by enabling organizations to boost efficiency, enhance employee experiences, and make data-driven decisions.",
      },
      {
        type: "paragraph",
        text: "Revolutionizing HR with AI",
        strong: true,
      },
      {
        type: "paragraph",
        text: "SAP SuccessFactors integrates AI to automate repetitive tasks, optimize talent acquisition, and enhance workforce planning. AI-driven analytics provide deep insights into employee performance, retention trends, and engagement levels, allowing HR leaders to make proactive, informed decisions.",
      },
      {
        type: "paragraph",
        text: "Enhanced Employee Experience",
      },
      {
        type: "paragraph",
        text: "With AI-powered chatbots and virtual assistants, employees get instant responses to HR queries, reducing dependency on HR teams. Personalized learning recommendations ensure employees stay ahead in their careers, fostering a culture of continuous growth.",
      },
      {
        type: "paragraph",
        text: "Data-Driven Decision Making",
        strong: true,
      },
      {
        type: "paragraph",
        text: "AI in SAP SuccessFactors enables predictive analytics to forecast workforce trends, identify skill gaps, and recommend succession plans. This empowers HR teams to align talent strategy with business goals effectively.",
      },
      {
        type: "paragraph",
        text: "Compliance and Risk Management",
        strong: true,
      },
      {
        type: "paragraph",
        text: "AI-driven compliance tools help organizations stay ahead of regulatory requirements by automating policy updates and monitoring workforce compliance in real time, reducing risks and ensuring governance.",
      },
      {
        type: "paragraph",
        text: "Conclusion",
        strong: true,
      },
      {
        type: "paragraph",
        text: "In a rapidly evolving and competitive business landscape, organizations must embrace innovation and adaptability to maintain a leading position. SAP SuccessFactors offers a comprehensive platform to transform HR operations, empowering businesses to attract, develop, and retain top talent while achieving operational efficiency. By integrating AI, SAP SuccessFactors is revolutionizing HR into a strategic function that drives business value, enabling organizations to build agile, data-driven, and employee-centric workplaces. As a trusted SAP SuccessFactors implementation partner, In2IT EBS is dedicated to delivering tailored strategies that align with your organizational objectives and drive long-term growth. Whether your operations span India, Singapore, Kenya, Dubai, the UAE, the USA, or Africa, our team is prepared to collaborate with you on your journey to workforce excellence. Together, let’s redefine the future of work, unlock new opportunities for success, and ensure long-term resilience in an ever-changing business landscape.",
      },
    ],
  },
  "igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas": {
    blocks: [
      {
        type: "image",
        src: "/insights/body/MicrosoftTeams-image-1024x122.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "At the annual SuccessConnect event at the Venetian Convention Center in Las Vegas, SAP unveiled how AI now encompasses the entire SAP SuccessFactors Human Experience Management Suite, enhancing the employee experience and informing all people decisions, including talent recruitment, internal mobility, learning, and performance management.",
      },
      {
        type: "paragraph",
        text: "These are the following the following AI capabilities showcased at SuccessConnect:",
      },
      {
        type: "paragraph",
        text: "Generative AI: use cases help people leaders and recruiters create job descriptions and help employees find personalized learning recommendations to fuel their career development and growth.",
      },
      {
        type: "paragraph",
        text: "Joule: a natural language built directly into the solutions that power mission-critical processes, Joule is a copilot that truly understands business",
      },
      {
        type: "paragraph",
        text: "The talent intelligence hub: enables organizations to better understand, build, and leverage the skills of their workforces. It can connect individual skills, attributes, strengths, and preferences to both people and experiences through SAP SuccessFactors solutions. By having talent intelligence integrated in SAP SuccessFactors HXM Suite, customers can have the power and simplicity of a single skills model from recruiting, onboarding, learning, and development, all the way through to performance and succession.",
      },
      {
        type: "paragraph",
        text: "AI Now Spans the Entire SAP SuccessFactors Human Experience Management Suite to Guide Every People Decision.",
      },
      {
        type: "paragraph",
        text: "For further details please reach us at info@in2itebs.com or the following phone numbers:",
      },
      {
        type: "paragraph",
        text: "India: +91 7042088080",
      },
      {
        type: "paragraph",
        text: "Singapore: +65 98239131",
      },
      {
        type: "paragraph",
        text: "Dubai: +971 56 238 7950",
      },
    ],
  },
  "grow-with-sap": {
    blocks: [
      { type: "heading", text: "Leadership Forum" },
      { type: "paragraph", text: "Quickly and Confidently Adopt Cloud ERP" },
      { type: "link", text: "Register Now", href: "/grow-with-sap-leadership-forum-event/" },
    ],
  },
  "in2it-ebs-simplify-talent-2": {
    blocks: [
      {
        type: "paragraph",
        text: "SimplifyTalent, an SAP Qualified Partner Package which leverages the global best practices of SAP SuccessFactors software solution portfolio aligning with Talent Management aspirations of Indian organizations.",
      },
      {
        type: "paragraph",
        text: "This package enables organizations across all industries to implement end-to-end spectrum of CoreHR, Performance and Goal Management Business Processes in a Rapid Deployment mode within 4 weeks.",
      },
      {
        type: "image",
        src: "/insights/body/1.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Single Source of Truth",
      },
      {
        type: "paragraph",
        text: "Enter information once for all HR tasks. Update on one, reflects on all",
      },
      {
        type: "image",
        src: "/insights/body/2.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Integration of Data",
      },
      {
        type: "paragraph",
        text: "Simplify different parts of the system can talk to each other, allowing more meaningful reporting & analysis capabilities",
      },
      {
        type: "image",
        src: "/insights/body/3.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Self Service",
      },
      {
        type: "paragraph",
        text: "A great time saver for HR. Employees may enter their own data or retrieve data without bothering HR.",
      },
      {
        type: "image",
        src: "/insights/body/4.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Accelerated Business Results",
      },
      {
        type: "listItem",
        text: "Instant retrieval & data processing",
      },
      {
        type: "listItem",
        text: "Availability of accurate & timely employee’s data",
      },
      {
        type: "listItem",
        text: "More transparency in the system",
      },
      {
        type: "image",
        src: "/insights/body/Picture2-1024x194.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "In the Cloud",
      },
      {
        type: "paragraph",
        text: "With SimplifyTalent cloud solutions, you get a lower, predictable monthly cost and faster time to value. It’s more flexible, scalable, and secure, and it’s faster.",
      },
      {
        type: "heading",
        text: "Platform",
      },
      {
        type: "paragraph",
        text: "SimplifyTalent contains a core set of functionalities common across the entire software suite. Whether you deploy the full HCM Suite or just a part of it.",
      },
      {
        type: "heading",
        text: "Mobile",
      },
      {
        type: "paragraph",
        text: "With smart phones and tablet computers, you can take advantage of the power of SimplifyTalent, anytime, anywhere.",
      },
      {
        type: "heading",
        text: "Extendible",
      },
      {
        type: "paragraph",
        text: "You can take advantage of extending other modules of SuccessFactors to co-exist with SimplifyTalent",
      },
      {
        type: "heading",
        text: "On-Top Optimizations",
      },
      {
        type: "paragraph",
        text: "Possible Integrating RPA/NLP Tools with SimplifyTalent for Souring automation for removing mundane jobs",
      },
      {
        type: "heading",
        text: "A seamless, integrated experience that encourages sharing information & gaining insight into your business",
      },
      {
        type: "image",
        src: "/insights/body/Picture3.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Performance & Goal Management",
      },
      {
        type: "image",
        src: "/insights/body/Picture4.jpg",
        alt: "",
      },
      {
        type: "paragraph",
        text: "WHAT DOES In2IT Enterprise Business Services OFFER?",
      },
      {
        type: "listItem",
        text: "SAP best practices implementation methodology – SAP Activate",
      },
      {
        type: "listItem",
        text: "Over 50+ certified SuccessFactors consultants across different modules",
      },
      {
        type: "listItem",
        text: "Extend SuccessFactors with other products",
      },
      {
        type: "listItem",
        text: "Dedicated support team",
      },
      {
        type: "listItem",
        text: "Skilled consultants to work on integration using HANA cloud platform, Dell Boomi",
      },
      {
        type: "listItem",
        text: "Presence across all major cities in Indi",
      },
      {
        type: "paragraph",
        text: "IN2IT EBS will provide:",
        strong: true,
      },
      {
        type: "listItem",
        text: "Data Migration Plan",
      },
      {
        type: "listItem",
        text: "Data Loading Templates",
      },
      {
        type: "listItem",
        text: "Loading the curated Information in Production System",
      },
      {
        type: "listItem",
        text: "Train the Trainer Sessions",
      },
      {
        type: "listItem",
        text: "User & Admin User Manuals",
      },
      {
        type: "listItem",
        text: "External QRGs for Client SPOCs",
      },
    ],
  },
  "in2it-ebs-simplify-hiring": {
    blocks: [
      {
        type: "paragraph",
        text: "Simplify Hiring is an SAP Qualified Partner Package which leverages the global best practices of SAP SuccessFactors solution portfolio, aligning with Recruitment & Onboarding aspirations of Indian organisations.",
      },
      {
        type: "paragraph",
        text: "This package enables organizations to implement end-to-end spectrum of Recruitment and Onboarding modules within a short span of 4 weeks",
      },
      {
        type: "image",
        src: "/insights/body/1.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "Faster Time to Hire, Lower Cost per Hire",
      },
      {
        type: "image",
        src: "/insights/body/2.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "Increased Recruiter, Hiring Manager Efficiency",
      },
      {
        type: "image",
        src: "/insights/body/3.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "Paperless Onboarding",
      },
      {
        type: "image",
        src: "/insights/body/4.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "A Fully Integrated response to Social Recruiting & Onboarding",
      },
      {
        type: "image",
        src: "/insights/body/hari1-1024x119.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "In the Cloud",
      },
      {
        type: "paragraph",
        text: "With SimplifyTalent cloud solutions, you get a lower, predictable monthly cost and faster time to value. It’s more flexible, scalable, and secure, and it’s faster.",
      },
      {
        type: "heading",
        text: "Platform",
      },
      {
        type: "paragraph",
        text: "SimplifyTalent contains a core set of functionalities common across the entire software suite. Whether you deploy the full HCM Suite or just a part of it.",
      },
      {
        type: "heading",
        text: "Mobile",
      },
      {
        type: "paragraph",
        text: "With smart phones and tablet computers, you can take advantage of the power of SimplifyTalent, anytime, anywhere.",
      },
      {
        type: "heading",
        text: "Extendible",
      },
      {
        type: "paragraph",
        text: "You can take advantage of extending other modules of SuccessFactors to co-exist with SimplifyTalent",
      },
      {
        type: "heading",
        text: "On-Top Optimizations",
      },
      {
        type: "paragraph",
        text: "Possible Integrating RPA/NLP Tools with SimplifyTalent for Souring automation for removing mundane jobs",
      },
      {
        type: "heading",
        text: "A seamless, integrated experience that encourages sharing information & gaining insight into your business",
      },
      {
        type: "heading",
        text: "SimplifyHiring",
      },
      {
        type: "image",
        src: "/insights/body/t1.png",
        alt: "",
      },
      {
        type: "heading",
        text: "WHAT DOES IN2IT enterprise business services OFFER?",
      },
      {
        type: "listItem",
        text: "SAP best practices implementation methodology – SAP Activate",
      },
      {
        type: "listItem",
        text: "Over 30+ certified SuccessFactors consultants across different modules",
      },
      {
        type: "listItem",
        text: "Extend SuccessFactors with other products",
      },
      {
        type: "listItem",
        text: "Dedicated support team",
      },
      {
        type: "listItem",
        text: "Skilled consultants to work on integration using HANA cloud platform, Dell Boomi",
      },
      {
        type: "listItem",
        text: "Presence across all major cities in India",
      },
      {
        type: "heading",
        text: "IN2IT EBS will provide :",
      },
      {
        type: "listItem",
        text: "Data Migration & Cutover Plan",
      },
      {
        type: "listItem",
        text: "Legacy Data Loading Templates",
      },
      {
        type: "listItem",
        text: "User & Admin User Manuals",
      },
      {
        type: "listItem",
        text: "QRGs for External Participant like Agency Users & Candidates.",
      },
    ],
  },
  "how-rise-with-sap-s-4hana-cloud-can-transform-your-business": {
    author: "Sridhar Ayalam",
    authorRole: "SAP Delivery Head, In2IT EBS",
    blocks: [
      {
        type: "heading",
        text: "How Rise with SAP S/4HANA Cloud Can Transform Your Business",
      },
      {
        type: "paragraph",
        text: "SAP S/4HANA Cloud is a next-generation enterprise resource planning (ERP) software solution that enables businesses to gain real-time insights and analytics for better decision-making. It is a cloud-based platform that offers various modules, including finance, procurement, supply chain, manufacturing, and sales. Rise with SAP, on the other hand, is a holistic program designed to help businesses simplify their digital transformation journey and accelerate their time-to-value. It provides end-to-end support for businesses to migrate to SAP S/4HANA Cloud, including deployment, customization, and ongoing maintenance and support.",
      },
      {
        type: "paragraph",
        text: "Digital transformation has become essential for businesses to stay competitive and relevant in today’s fast-paced, technology-driven landscape. It is a process of adopting digital technologies and modernizing business processes to improve efficiency, reduce costs, and enhance customer experiences. The need for digital transformation has been further amplified by the COVID-19 pandemic, which has accelerated the adoption of digital technologies across various industries.",
      },
      {
        type: "paragraph",
        text: "By leveraging the power of SAP S/4HANA Cloud and Rise with SAP, businesses can streamline their digital transformation journey and gain a competitive edge in their industry. These solutions provide businesses with the agility and flexibility to adapt to changing market conditions and customer demands, which is crucial in today’s uncertain business environment.",
      },
      {
        type: "heading",
        text: "Benefits of SAP S/4HANA Cloud",
      },
      {
        type: "paragraph",
        text: "SAP S/4HANA Cloud offers several benefits to businesses, including:",
      },
      {
        type: "paragraph",
        text: "Improved agility and efficiency: SAP S/4HANA Cloud provides businesses with a flexible and scalable platform that can adapt to changing business needs. It offers real-time insights into business operations, enabling businesses to make data-driven decisions quickly. It also simplifies business processes, reduces manual effort, and improves operational efficiency.",
      },
      {
        type: "paragraph",
        text: "Real-time insights and analytics: SAP S/4HANA Cloud provides businesses with real-time analytics that enable them to gain insights into their operations, customers, and markets. It offers predictive analytics capabilities that can help businesses forecast trends and identify opportunities for growth.",
      },
      {
        type: "paragraph",
        text: "Better decision-making capabilities: With real-time insights and analytics, businesses can make informed decisions quickly. SAP S/4HANA Cloud provides businesses with a unified view of their operations, enabling them to make decisions based on a holistic view of their business.",
      },
      {
        type: "paragraph",
        text: "Enhanced customer experiences: SAP S/4HANA Cloud enables businesses to provide personalized and seamless customer experiences. It enables businesses to streamline their sales and service processes, provide customers with real-time updates, and respond to customer queries quickly.",
      },
      {
        type: "paragraph",
        text: "By leveraging these benefits, businesses can improve their operations, reduce costs, and enhance customer experiences, among other benefits.",
      },
      {
        type: "heading",
        text: "What is Rise with SAP?",
      },
      {
        type: "paragraph",
        text: "Rise with SAP is a comprehensive program designed to help businesses simplify their digital transformation journey and accelerate their time-to-value. It provides end-to-end support for businesses to migrate to SAP S/4HANA Cloud, including deployment, customization, and ongoing maintenance and support.",
      },
      {
        type: "paragraph",
        text: "The program offers several features and benefits, including:",
      },
      {
        type: "paragraph",
        text: "Flexible commercial models: Rise with SAP offers flexible commercial models that enable businesses to pay for what they use. It provides businesses with predictable costs and reduced risk, enabling them to manage their budgets more effectively.",
      },
      {
        type: "paragraph",
        text: "Tailored solutions: Rise with SAP provides businesses with tailored solutions that meet their specific needs. It offers pre-configured industry solutions and templates that enable businesses to accelerate their deployment and reduce the time-to-value.",
      },
      {
        type: "paragraph",
        text: "Simplified migration: Rise with SAP simplifies the migration process for businesses. It provides end-to-end support for migration, including data migration, system integration, and testing. It also offers tools and accelerators that enable businesses to reduce the time and effort required for migration.",
      },
      {
        type: "paragraph",
        text: "Continuous innovation: Rise with SAP enables businesses to stay up-to-date with the latest innovations and updates from SAP. It provides ongoing maintenance and support, including bug fixes, security patches, and system updates.",
      },
      {
        type: "paragraph",
        text: "By leveraging the features and benefits of Rise with SAP, businesses can simplify their digital transformation journey and achieve their goals quickly and efficiently.",
      },
      {
        type: "heading",
        text: "How to Get Started with Rise with SAP S/4HANA Cloud",
      },
      {
        type: "paragraph",
        text: "Getting started with Rise with SAP and SAP S/4HANA Cloud is a straightforward process. Here are the steps businesses can take to begin their digital transformation journey:",
      },
      {
        type: "paragraph",
        text: "Step 1: Assess the Current State",
        strong: true,
      },
      {
        type: "paragraph",
        text: "The first step is to assess the current state of the business. Businesses need to identify their pain points, challenges, and opportunities. They should also identify their business goals and objectives and determine how SAP S/4HANA Cloud can help them achieve these goals.",
      },
      {
        type: "paragraph",
        text: "Step 2: Plan the Migration",
        strong: true,
      },
      {
        type: "paragraph",
        text: "The second step is to plan the migration to SAP S/4HANA Cloud. Businesses need to determine which modules and features they need and how they want to deploy the system. They should also consider the timeline, budget, and resource requirements for the migration.",
      },
      {
        type: "paragraph",
        text: "Step 3: Choose the Right Partner",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Choosing the right partner is crucial for a successful migration. Businesses should look for a partner with experience in SAP S/4HANA Cloud deployment and migration. They should also consider factors such as pricing, support, and customer service.",
      },
      {
        type: "paragraph",
        text: "Step 4: Deploy and Customize",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Once the planning is complete, the next step is to deploy and customize the system. Businesses should work closely with their partner to ensure a smooth deployment and customization process. They should also consider training and change management to ensure that employees are prepared for the new system.",
      },
      {
        type: "paragraph",
        text: "Step 5: Maintain and Support",
        strong: true,
      },
      {
        type: "paragraph",
        text: "The final step is to maintain and support the system. Businesses should consider ongoing maintenance and support to ensure that the system is up-to-date and running smoothly. They should also consider future upgrades and enhancements to the system.",
      },
      {
        type: "paragraph",
        text: "By following these steps, businesses can successfully migrate to SAP S/4HANA Cloud with Rise with SAP and enjoy the benefits of a modern, cloud-based ERP system.",
      },
      {
        type: "heading",
        text: "Conclusion",
      },
      {
        type: "paragraph",
        text: "In conclusion, Rise with SAP S/4HANA Cloud is a comprehensive program that provides businesses with end-to-end support for their digital transformation journey. It offers several benefits, including improved agility, real-time insights and analytics, better decision-making capabilities, and enhanced customer experiences. With Rise with SAP, businesses can simplify their migration to SAP S/4HANA Cloud and accelerate their time-to-value.",
      },
      {
        type: "paragraph",
        text: "To get started with Rise with SAP, businesses should assess their current state, plan the migration, choose the right partner, deploy and customize the system, and maintain and support the system. By following these steps, businesses can successfully migrate to SAP S/4HANA Cloud and achieve their business goals.",
      },
      {
        type: "paragraph",
        text: "In today’s digital age, businesses need to leverage modern technologies such as cloud-based ERP systems to stay competitive and grow their businesses. Rise with SAP S/4HANA Cloud provides businesses with a platform to achieve these goals and drive their digital transformation journey.",
      },
      {
        type: "heading",
        text: "Additional Resources",
      },
      {
        type: "paragraph",
        text: "For businesses interested in learning more about Rise with SAP S/4HANA Cloud, SAP offers several additional resources, including:",
      },
      {
        type: "paragraph",
        text: "SAP website: The SAP website provides detailed information on Rise with SAP S/4HANA Cloud, including features, benefits, and pricing models.",
      },
      {
        type: "paragraph",
        text: "SAP Community: The SAP Community is a platform for SAP users to connect, learn, and share knowledge. It offers forums, blogs, and other resources on Rise with SAP S/4HANA Cloud and other SAP products and solutions.",
      },
      {
        type: "paragraph",
        text: "SAP Learning Hub: The SAP Learning Hub is an online learning platform that provides training and certification courses on SAP products and solutions. It offers courses on Rise with SAP S/4HANA Cloud deployment, migration, and customization.",
      },
      {
        type: "paragraph",
        text: "SAP Partners: SAP has a network of partners that offer deployment, migration, and customization services for SAP S/4HANA Cloud. Businesses can find a partner in their region by visiting the SAP website.",
      },
      {
        type: "paragraph",
        text: "By leveraging these resources, businesses can learn more about Rise with SAP S/4HANA Cloud and how it can help them achieve their business goals. They can also find partners and training courses to support their digital transformation journey.",
      },
      {
        type: "heading",
        text: "In2IT EBS – A Gold Partner of SAP",
      },
      {
        type: "paragraph",
        text: "Are you searching for a reliable partner to implement Rise with SAP S/4HANA Cloud and provide expert Application Management and Cloud (AMC) support? Look no further than In2IT EBS (www.in2itebs.com), a leading SAP partner with more than 6 years of experience in delivering end-to-end SAP solutions.",
      },
      {
        type: "paragraph",
        text: "At In2IT EBS, our team of experts has successfully implemented Rise with SAP S/4HANA Cloud for numerous clients across various industries. We understand that each business has unique requirements, and we work closely with our clients to tailor the solution and ensure a smooth migration process.",
      },
      {
        type: "paragraph",
        text: "Once the implementation is complete, we provide ongoing AMC support to ensure that our clients’ systems are running smoothly and efficiently. Our comprehensive support services include monitoring, issue resolution, system enhancements, and regular system maintenance.",
      },
      {
        type: "paragraph",
        text: "We are committed to delivering top-quality solutions and services that empower our clients to achieve their business objectives. With our extensive knowledge of SAP solutions and our customer-centric approach, we can help businesses streamline their operations and drive growth.",
      },
      {
        type: "paragraph",
        text: "Choose In2IT EBS as your trusted partner for Rise with SAP S/4HANA Cloud implementation and AMC support and experience the benefits of working with a reliable SAP partner. Get in touch with us today to learn more about our services and how we can help your business achieve success.",
      },
    ],
  },
  "coronavirus-lockdown-leads-to-more-gaming-and-e-sports": {
    blocks: [
      {
        type: "paragraph",
        text: "The esports and gaming part may end up being an unexpected champ as ~45 M or more Chinese are in lockdown to forestall the spread of the coronavirus. The Chinese are immense gamers and love their esports. As far as clients, China is the world’s biggest game spilling market, with roughly 4.9 occasions the month to month dynamic clients of the U.S. advertising in 2018.",
      },
      {
        type: "paragraph",
        text: "Being restricted to your home methods investing more energy and cash on the web, which may demonstrate a lift to the Chinese esports and gaming division in H1 2020. China coronavirus lockdown may help Chinese gaming and sports some key stocks and ETFs to profit by expanded gaming and esports in China include:",
      },
      {
        type: "paragraph",
        text: "Tencent – The China chief in esports game gushing, and the online gaming division. Tencent obtained Riot Games and now claims the exceptionally mainstream League of Legends game. Tencent possesses the number 2 positioned game gushing stage in China named DouYu. Doug basically centers around the live-gushing of games and had 159.2 MAUs in Q1 2019. Tencent likewise makes different pc and online mobile games.",
      },
      {
        type: "paragraph",
        text: "Huya – Huya is known as the “Jerk of China”, and is the number 1 positioned game gushing stage in China.",
      },
      {
        type: "paragraph",
        text: "Geek and ESPO – For those favoring an esports ETF, at that point NERD and ESPO are two of the best to consider. They do have more extensive worldwide esports and gaming introduction with NERD being progressively adjusted to esports.",
      },
      {
        type: "paragraph",
        text: "A report this week titled: “How an unmistakable B.C. privately-run company made the greatest e-sports gaming system in North America”, took a gander at the historical backdrop of Enthusiast Gaming and the Aquilinis family. Basically the story depicts the Aquilinis family inclusion in building a monster esports unadulterated play organization. What is astounding is the manner by which quick they have advanced but then they despite everything fly under most speculator’s radar.",
      },
      {
        type: "paragraph",
        text: "Lover Gaming Holdings Inc. is one of the quickest developing esports organizations internationally, and one of just a couple traded on an open market, unadulterated play esports and gaming organizations. Lover Gaming has the biggest gaming system in North America and the English talking gaming districts. The drawn-out vision for the Company is to construct the biggest, vertically coordinated esports and gaming organization on the planet. The Company arrives at more gamers than Twitch, IGN, Gamespot in the USA; and reaches more than 200 million gamers on a month to month premise, with 1 billion page views. Atari is opening its own gaming inns in eight US cities Atari is most popular for its games which started, harking back to the ’70s. In any case, presently the Company is reacting to the esports wonder. Atari plans to open their own chain of marked inns that will include spaces for computer-generated reality and enlarged reality, studios for online games , and settings for tossing esports occasions. What a splendid thought.",
      },
    ],
  },
  "future-where-technology-creates-good-jobs": {
    author: "Dr. Sanjeev Kumarr Dixit",
    authorRole: "CHRO – Mrs. Bectors Food Specialities Ltd. (Author – PLAN C)",
    blocks: [
      {
        type: "paragraph",
        text: "9th May 2022 is a day to remember and celebrate as a MBFSL team as together are taking a LEAP (Leveraging Effectiveness thru Automating Processes) by moving from manual way of working to online cloud based globally acclaimed Human Capital Management system – SAP SuccessFactors.",
      },
      {
        type: "paragraph",
        text: "All our self-information, employee master data, personal and professional details, organisation structures , leave management, joining and exit process formalities etc and entire GROW Performance Management system from GROW KRAs setting , Monthly Targets vs actuals review, Annual Performance Review comprising of Self-assessment, managers’ assessment, Reviewers appraisal and finally calibration by HR which will you will experience just through login id and password which will be part of all your onboarding training on the subject post LEAP going LIVE on 9th May.",
      },
      {
        type: "paragraph",
        text: "The entire week of 9th May till 14th May will be LEAP WEEK wherein our implementation partner team from In2IT will facilitate User Training to all of us besides sharing self-help user manuals for usage. All HR Team members and concerned Managers will support all of us to understand, use and leverage LEAP for self, team and organisation effectiveness, better efficiency, productivity, and WOW experience. At this juncture like to thank with lots of humility to each and every team member from HR team for putting their sincere hard work and compete dedicated time to complete the entire LEAP project in record time from end to end in 04 months which by all standard is a stretched target. Also, this feat won’t be possible without expert contribution and able project management by our implementation partner In2IT who also worked with HR team shoulder to shoulder to achieve the deadline. At this juncture like to thank with lots of humility to each and every team member from HR team for putting their sincere hard work and compete dedicated time to complete the entire LEAP project in record time from end to end in 04 months which by all standard is a stretched target. Also, this feat won’t be possible without expert contribution and able project management by our implementation partner In2IT who also worked with HR team shoulder to shoulder to achieve the deadline.",
      },
      {
        type: "paragraph",
        text: "There might be teething issue in the beginning like any new system but we together as a TEAM will ensure that we turn every opportunity into fresh and great learning experience",
      },
      {
        type: "paragraph",
        text: "ENJOY AND REAP THE BENEFITS OF LEAP",
        strong: true,
      },
    ],
  },
  "what-you-do-today-improve-your-tomorrows": {
    author: "Kunwar Krishna Menon",
    authorRole: "Country Sales Manager, In2IT Enterprise Business Services Pvt. Ltd.",
    authorDate: "April 18, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "You’ve probably heard about CRMs but do you know what the benefits are for implementing one at your business?",
      },
      {
        type: "paragraph",
        text: "It’s fair to say that your customers are essential – after all, no business can exist if it has no customer base. Of course, how companies manage their customer database, therefore, has a major impact on their success.",
      },
      {
        type: "paragraph",
        text: "Customer relationships are key, and this is the primary reason why businesses now consider the adoption of a CRM – they wish to improve the consistency and quality of their customer relationships while building better customer loyalty.",
      },
      {
        type: "paragraph",
        text: "But how do CRM’s help companies to improve their customer relationships? Let’s take a closer look at some of the key benefits they offer.",
      },
      {
        type: "heading",
        text: "Understanding Customers Better",
      },
      {
        type: "paragraph",
        text: "CRMs keep all of your customer information in a single location. This makes access to the data a breeze, thus giving sales, customer service and marketing teams the competitive edge. They won’t just know the name, address, email, phone number, and social media connections for each contact, but they’ll also know their position within their company, how they connect with other contacts within the dataset, when their birthday is, and which languages they speak.",
      },
      {
        type: "paragraph",
        text: "With all of that data in easy reach, it’s a breeze to personalise communications.",
      },
      {
        type: "heading",
        text: "Improved Segmentation",
      },
      {
        type: "paragraph",
        text: "A CRM allows your business to segment contacts into separate target audiences. It breaks data down by criteria and categories to create highly focused lists. This allows specific campaigns to be run for specific segments of your audience. It also allows sales processes and lead pools to be analysed effectively.",
      },
      {
        type: "heading",
        text: "Retaining More Customers",
      },
      {
        type: "paragraph",
        text: "A CRM helps to keep existing customers satisfied by prompting regular contact with customers. It also orchestrates effective marketing activities such as sending email campaigns, after-purchase surveys, and free trial offers at the best times.",
      },
      {
        type: "heading",
        text: "Anticipating Needs",
      },
      {
        type: "paragraph",
        text: "A CRM allows you to track each customer’s buying habits so you can present them with the best offers for them at the perfect moment. It also allows timely customer service interaction, for example if the customer has experienced an issue or made a complaint.",
      },
      {
        type: "heading",
        text: "Faster Communication",
      },
      {
        type: "paragraph",
        text: "CRM systems offer a set of ready to use, customisable letters, email templates, documents, quotes, proposals, newsletters and invitations to speed up communications.",
      },
      {
        type: "heading",
        text: "Better Data Privacy",
      },
      {
        type: "paragraph",
        text: "The recent GDPR requirements have meant that CRM systems come with inbuilt functionality in this regard. This saves a huge job for businesses, since GDPR compliancy can be a time-consuming and stressful task that has major legal consequences if you fall foul of the law.",
      },
      {
        type: "heading",
        text: "CRM Systems Are An Ideal Solution For Businesses",
      },
      {
        type: "paragraph",
        text: "In this modern age, all businesses can benefit from having a CRM system in place. Not only can it improve productivity and efficiency in their workplace, but it can also help to maximise the impact of marketing campaigns and help to retain the maximum number of customers.",
      },
      {
        type: "paragraph",
        text: "With so many benefits to offer, it’s certainly time to consider implemented one at your business and harnessing its full potential.",
      },
    ],
  },
  "attract-and-retain-quality-high-paying-customers": {
    author: "Sridhar Ayalam",
    authorRole: "SAP Delivery Head, In2IT Enterprise Business Services Pvt. Ltd.",
    authorDate: "April 05, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "Enterprise Resource Planning (or ERP) software has revolutionised the ways in which companies work in the modern world. Efficiency and speed are now paramount in today’s highly competitive marketplace, and this is where ERP software can really help, since it allows for ongoing tasks and projects to be managed in a timely manner, thus streamlining the routine business of daily work and exponentially boosting productivity and profitability.",
      },
      {
        type: "paragraph",
        text: "There are five key business inefficiencies that ERP software can tackle easily and we’ll take a look at them below.",
      },
      {
        type: "heading",
        text: "Inaccurate Manually Entered Data",
      },
      {
        type: "paragraph",
        text: "Most people will agree that one of the most tedious and time-consuming tasks in any organisation is entering data manually. Being such a repetitive and dull job, it can cause humans to become distracted and make mistakes. It’s no wonder, then, that human error is common in this area. ERP software cannot just save time but also slash costs when it comes to data entry, and it also provides highly precise and accurate results.",
      },
      {
        type: "heading",
        text: "Inefficient Communications",
      },
      {
        type: "paragraph",
        text: "Many businesses have several departments, but if there is a lack of communication between those departments, tasks often take longer to finish and productivity is low. ERP software significantly reduces this problem while also minimising the communication gap with freelancers and vendors via vendor management software.",
      },
      {
        type: "heading",
        text: "No Interconnected Data",
      },
      {
        type: "paragraph",
        text: "When companies have multiple departments, they run the risk of working with no interconnected data – something that can prove costly in terms of bad debts, wasted inventory and lost customers. ERP software helps companies to interconnect their data in real time to boost productivity and efficiency.",
      },
      {
        type: "heading",
        text: "Poor Customer Service",
      },
      {
        type: "paragraph",
        text: "Companies can earn a poor reputation if their customer service is substandard. If the sales of a product are greater than the speed at which that product is replenished, sales departments often lack the knowledge of when it will be restocked.",
      },
      {
        type: "paragraph",
        text: "Being unable to tell customers a precise delivery date can cause dissatisfaction and, eventually, attrition of customers to rival businesses. ERP software boasts helpful functions like sales order management and inventory management software that can make operations run more smoothly.",
      },
      {
        type: "heading",
        text: "No Consolidated Data",
      },
      {
        type: "paragraph",
        text: "In a multi-department organisation, data can vary between them. Should the data not be consolidated and stored in a single location, it takes managers more time to go through every document and spreadsheet to find the information they need. ERP software keeps all of the data in a single spot so it can be accessed with ease. It also ensures more accurate results with minimal effort.",
      },
      {
        type: "heading",
        text: "The Benefits Of ERP Software",
      },
      {
        type: "paragraph",
        text: "The above five business inefficiencies can all easily be identified and resolved by implementing ERP software. This effective solution can make organisations run much more smoothly and in a streamlined way that increases productivity and profitability. It’s easy to see, therefore, why ERP software is such an excellent solution to improving the efficiency of companies across the board and to eliminating many of the issues that cause businesses to be inefficient.",
      },
    ],
  },
  "solutions-for-all-small-and-large-business": {
    author: "Gangadhar Panda",
    authorDate: "April 07, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "Finding ways to automate sales is one of the top priorities of many companies. After all, it’s a solution that can make the business more profitable through more efficient streamlining of operations. The top answer to automating sales today is to use a CRM, but this, in itself, can cause some problems for business leaders who lack expertise and knowledge in the field.",
      },
      {
        type: "paragraph",
        text: "With this in mind, it’s clear that finding the CRM that is best for automating your sales isn’t always an easy task. You need to do your research well so that you can make a well-informed decision. Here, we take a closer look at what you need to consider when it comes to finding the most efficient and effective DRM for your sales automation.",
      },
      {
        type: "heading",
        text: "1. Understand The Requirements Of Your Business",
      },
      {
        type: "paragraph",
        text: "The requirements of your business dictate the type of CRM you’re going to need. Consider the difficulties your business is facing. Are you:",
      },
      {
        type: "listItem",
        text: "Struggling to find customer data?",
      },
      {
        type: "listItem",
        text: "Finding communicating with clients difficult?",
      },
      {
        type: "listItem",
        text: "Finding it hard to create new customers or retain loyal ones?",
      },
      {
        type: "listItem",
        text: "Having difficulty in managing schedules?",
      },
      {
        type: "paragraph",
        text: "These are just some of the areas that you need to weigh up so you can choose the right CR.",
      },
      {
        type: "heading",
        text: "2. Know The Different Kinds Of CRM",
      },
      {
        type: "paragraph",
        text: "There is no such thing as a one-size-fits-all type of CRM. You need to be aware of the differences between operational CRMs, analytical CRMs, and collaborative CRMs. This will help you pinpoint the best choice.",
      },
      {
        type: "heading",
        text: "3. Look At The Features",
      },
      {
        type: "paragraph",
        text: "Some features to consider when choosing the right CRM for your business include:",
      },
      {
        type: "listItem",
        text: "Its main functionality",
      },
      {
        type: "listItem",
        text: "Its collaboration features",
      },
      {
        type: "listItem",
        text: "How customisable it is",
      },
      {
        type: "listItem",
        text: "How easy it is to use and integrate into existing systems",
      },
      {
        type: "listItem",
        text: "How secure it is",
      },
      {
        type: "listItem",
        text: "How much support is available",
      },
      {
        type: "paragraph",
        text: "Look for the following capabilities in any software you choose:",
      },
      {
        type: "listItem",
        text: "Lead management",
      },
      {
        type: "listItem",
        text: "Contact management",
      },
      {
        type: "listItem",
        text: "Automation",
      },
      {
        type: "listItem",
        text: "Campaign management",
      },
      {
        type: "listItem",
        text: "Email tracking",
      },
      {
        type: "listItem",
        text: "Social media management",
      },
      {
        type: "listItem",
        text: "Dashboards and reports",
      },
      {
        type: "listItem",
        text: "Mobile apps",
      },
      {
        type: "heading",
        text: "4. Consider Costs",
      },
      {
        type: "paragraph",
        text: "It’s important to choose a CRM that fits into your business’s budget. There are free solutions available if necessary.",
      },
      {
        type: "heading",
        text: "5. Choose A Reliable Vendor",
      },
      {
        type: "paragraph",
        text: "Make sure you only use a CRM that comes from a reputable vendor that has good customer support and a solid reputation.",
      },
      {
        type: "heading",
        text: "Choose A CRM Which Is Right For You",
      },
      {
        type: "paragraph",
        text: "At the end of the day, there’s no such thing as one “best” CRM. Each business will have its own needs and requirements. Therefore, the best CRM for one company will be completely different from that required by another.",
      },
      {
        type: "paragraph",
        text: "If you consider the points that we’ve addressed here carefully, you should have the information that you need to carry out the necessary research into which CRM software to select. As long as you spend sufficient time considering the essential requirements of your business and the needs that you require your CRM software to address, you will be able to select a product that is perfect for your company’s purposes and that will help to improve the productivity, efficiency, and profitability of your organisation.",
      },
    ],
  },
  "live-stream-from-awwwards-showcasing-trends": {
    author: "Sudhansu Sekhar Mishra",
    authorRole: "AGM IT Application, In2IT Enterprise Business Services Pvt. Ltd.",
    authorDate: "March 29, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "Hubspot’s 2022 Hybrid Work Report focused on the ways in which the world worked during 2021 as well as what is likely to lie ahead in the future. So, what did it say? Here, we take a closer look at its contents and what they reveal.",
      },
      {
        type: "heading",
        text: "The COVID Chaos",
      },
      {
        type: "paragraph",
        text: "The COVID-19 pandemic has certainly had an unimaginably powerful effect on society during the last two years. Now that 2022 has arrived, and a “new normal” appears to be on the horizon, it’s time to consider the impact that the global crisis has had on our working lives.",
      },
      {
        type: "paragraph",
        text: "One key change that arose during the pandemic was the need for remote and home working due to the voluntary and imposed lockdowns around the globe. Therefore, what did the HubSpot survey of four thousand full-time flex, in-office, and remote workers from across the US, UK, Germany, Ireland, France, Japan, Australia, and Canada reveal about culture, collaboration, communication, management, and mental health?",
      },
      {
        type: "heading",
        text: "Better Flexibility",
      },
      {
        type: "paragraph",
        text: "Interestingly, a key feature of the report was the note that employees had enjoyed having the opportunity of working both onsite in the office and remotely. This has, in turn, led to numerous companies considering the possibility of embracing and adopting the hybrid work model.",
      },
      {
        type: "paragraph",
        text: "The report suggested that hybrid working will be around for some time to come, and in 2022, the priority will be to future-proof that work model.",
      },
      {
        type: "heading",
        text: "Collaboration And Communication Present More Challenges",
      },
      {
        type: "paragraph",
        text: "When companies have hybrid workforces, collaboration and communication becomes more challenging. Almost half of all remote workers surveyed reported that they missed in-person, spontaneous connections with other colleagues.",
      },
      {
        type: "paragraph",
        text: "Almost 60% of workers still onsite found that connecting with their teams and staying motivated with the main challenges when it came to transitioning to in-office work from working from home. Meanwhile 61% of flexible workers agreed that they had an effective working relationship with their team within their hybrid environment.",
      },
      {
        type: "paragraph",
        text: "It was perhaps telling that almost 40% of respondents said they’d prefer to go to the dentist every month than go to the office five days each week!",
      },
      {
        type: "heading",
        text: "Employee Experience Helps Culture Thrive",
      },
      {
        type: "paragraph",
        text: "A fifth of flexible workers saw differences between the remote and in-office employee experience as one 20% of flex workers see differences in the in-office and remote employee experience as an obstacle to success.",
      },
      {
        type: "paragraph",
        text: "Meanwhile 60% of people ranked a better work/life balance as their top aspect of their company’s culture. Almost half of all survey respondents said they’d rather have an extra day off during the week than an increased salary, while 31% believed opportunities to supply anonymous feedback would make them feel more included and supported in the workplace.",
      },
      {
        type: "heading",
        text: "Better Communication For Better Long-Term Productivity",
      },
      {
        type: "paragraph",
        text: "In the report, 34% of flexible workers said they actively went to the office in order to communicate more effectively with their colleagues, but 72% of respondents said that too many meetings and calls in the workplace disrupted their concentration.",
      },
      {
        type: "heading",
        text: "Holistic Approaches to Mental Health",
      },
      {
        type: "paragraph",
        text: "In the last year, 40% of respondents said they’d had a better work/life balance, but nevertheless, almost 60% said that they found it hard to set the right boundaries between their work and personal lives. Caregivers and parents especially agreed that they felt under pressure to be “permanently on” in working hours, regardless of their home situations.",
      },
      {
        type: "heading",
        text: "Better Resources For Team Support",
      },
      {
        type: "paragraph",
        text: "Management appeared to be problematic, with almost 30% of flexible workers finding that managing remote workers was their toughest challenge when working with hybrid teams. Meanwhile almost half of all managers reported breakdowns in communication as their top concern. Fortunately, though, 60% of them believed they had the correct tools to manage effectively even in the hybrid working environment.",
      },
    ],
  },
};
