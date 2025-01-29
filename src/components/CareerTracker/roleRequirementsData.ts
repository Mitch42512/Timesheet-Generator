interface Requirement {
  title: string;
  items: string[];
}

interface RoleRequirements {
  [key: string]: Requirement[];
}

export const roleRequirements: RoleRequirements = {
  'graduate': [
    {
      title: 'Managing Clients and Relationships',
      items: [
        'Insert Graduate Roles',
        'Insert Graduate Roles',
        'Insert Graduate Roles'
      ]
    },
    {
      title: 'Winning and Selling Work',
      items: [
        'Insert Graduate Roles'
      ]
    },
    {
      title: 'Project Management',
      items: [
        'Insert Graduate Roles',
        'Insert Graduate Roles',
        'Insert Graduate Roles'
      ]
    },
    {
      title: 'Delivery and Execution',
      items: [
        'Insert Graduate Roles',
        'Insert Graduate Roles',
        'Insert Graduate Roles'
      ]
    },
    {
      title: 'People Management',
      items: [
        'Insert Graduate Roles',
        'Insert Graduate Roles'
      ]
    },
    {
      title: 'Commercial Acumen',
      items: [
        'Insert Graduate Roles',
        'Insert Graduate Roles',
        'Insert Graduate Roles'
      ]
    }
  ],
  'client-executive': [
    {
      title: 'Managing Clients and Relationships',
      items: [
        'Begins to build rapport with clients. Handles basic client enquiries.',
        'Understands fundamentals of research; conducts background research from secondary sources; collaborates with peers to collate information required for client.',
        'Implements account planning actions and administers client feedback as directed.'
      ]
    },
    {
      title: 'Winning and Selling Work',
      items: [
        'Aware of and understands our offer'
      ]
    },
    {
      title: 'Project Management',
      items: [
        'Manages a range of tasks throughout the projects workflow following Quality Standards.',
        'Understands the principles of daily fieldwork monitoring, sample and quota management, link and whole count checking. Takes accountability where relevant.',
        'Can accurately estimate the LOI of a survey script. Takes responsibility for signing off basic scripts as being 100% accurate.',
        'Monitors timelines throughout the life of the project, communicating progress with clients and the internal team.',
        'Establishes partnerships with all key internal stakeholders (including Onshore and Offshore Operations) through building credibility and rapport and instilling a one team mindset.',
        'Understands and knows how to implement SDM ways of working and best practice across relevant projects with support where required',
        'Develops experience in managing projects from start to finish whilst actively looking for efficiency and effectiveness gains.'
      ]
    },
    {
      title: 'Delivery and Execution',
      items: [
        'Understands and knows the basics on how to implement Kantar Goldstar framework.',
        'Ensures adherence to SDM RACI where relevant, adopts SDM must use documents, following first time right behaviour',
        'Maintains accurate data/table specs on all projects. Takes responsibility for perfect quality of data tables and accurate data extraction e.g., from tables into reports.',
        'Utilities Q/RFS effectively and correctly to run analysis.',
        'Hones PPT and Slickslides skills to uphold Kantar branding standards in all deliverables.',
        'Collates data to contribute clearly, accurately and effectively to answering the clients business issues. Develops skills in writing basic commentary in reports.',
        'Assists in preparing presentations or workshops and attends if appropriate.'
      ]
    },
    {
      title: 'People Management',
      items: [
        'Self: Manages own time effectively. Seeks opportunities for self learning. Takes advantage of training opportunities on offer.',
        'Others: Provides on the job feedback to team members and line manager to enable others to flourish. Participates in office related activities to maintain a positive work culture and encourages others to do the same.'
      ]
    },
    {
      title: 'Commercial Acumen',
      items: [
        '100% compliance of weekly accurate timesheet submissions.',
        'Understands the impact of their time spent on job profitability and utilisation.',
        'Can complete basic Ad Hoc cost requests and understands the impact of cost on profitability.'
      ]
    }
  ],
  'snr-client-executive': [
    {
      title: 'Managing Clients and Relationships',
      items: [
        'Engages with clients on a day to day basis; Manages client expectations and implications regarding simple project design, timings with team.',
        'Understands the fundamentals of marketing and basic understanding of client issues.',
        'Contributes to regular account plan sessions (including 90-day action plans).',
        'Seeks client feedback on projects formally after major milestones.'
      ]
    },
    {
      title: 'Winning and Selling Work',
      items: [
        'Assists on the conversion of an opportunity to brief.',
        'Attends brainstorms for proposals and actively contributes solution ideas to the proposal brainstorm.',
        'Ability to contribute to winning proposals by writing section(s) (e.g. on methodology/project design, timelines and deliverables) on their accounts.'
      ]
    },
    {
      title: 'Project Management',
      items: [
        'Actively and proactively looks for efficiency, automation and effectiveness gains and finds ways to implement these.',
        'Understands and knows how to implement SDM ways of working and best practice across relevant projects with support where required',
        'Establishes partnerships with all key internal stakeholders (including Onshore and Offshore Operations) through building credibility and rapport and instilling a one team mindset.',
        'Builds an open feedback culture with all teams supporting continuous improvement mentality particularly when working with GDC PM members, working with the team to identify and mitigate risks/resolves problems',
        'Ensures on time delivery of projects, or escalates to ensure senior team member can manage this with the client.',
        'Develops simple questionnaires and ensures questions are aligned with client objectives. Can accurately estimate length of a questionnaire prior to it being written (based on client requirements).'
      ]
    },
    {
      title: 'Delivery and Execution',
      items: [
        'Implements Kantar Achievers Scheme framework on selected accounts.',
        'Ensures analysis plans are completed for each project; designs DP specs to request all relevant tables necessary. Can identify and specify more complex analysis proactively. Takes final responsibility for perfect quality of data.',
        'Provides accurate preliminary analysis and conclusions. Knows how to display data and themes within a storyline. Contributes to insightful report commentary.',
        'Is building effective and engaging presentation skills internally (plus occasionally presenting to clients).',
        'Contributes to the project review process, ensuring collaborative problem solving and implementation of learning'
      ]
    },
    {
      title: 'People Management',
      items: [
        'Self: Buddies Client Executives. Shares and applies new knowledge and ideas. Aware of the need to continually improve all practices.',
        'Others: Can identify training needs for CEs and escalates to senior team members. Participates in office related activities to maintain a positive work culture and encourages others to do the same.'
      ]
    },
    {
      title: 'Commercial Acumen',
      items: [
        'Understands direct costs and does all they can to ensure these remain within budget.',
        'Understands impact of costing decisions; Reviews SOWs (Statement of Works); Can complete a basic costing request (i.e.: fill in the Pricing sheet or KMP request email form).',
        '100% compliance of weekly accurate timesheet submissions.',
        'Understands the impact of their time spent on job profitability and utilisation'
      ]
    }
  ],
  'client-manager': [
    {
      title: 'Managing Clients and Relationships',
      items: [
        'Responsible for day to day running of accounts / projects. Actively manages client expectations and implications regarding medium complexity project design, costs, and timings.',
        'Builds strong relationships in client organisation.',
        'Makes an active contribution to business conversations with client.',
        'Demonstrates a breadth and depth of understanding of clients issues.',
        'Participates in regular account planning sessions (including 90-day action plans) for client accounts.',
        'Applies research fundamentals and can coach others on fundamentals'
      ]
    },
    {
      title: 'Winning and Selling Work',
      items: [
        'Evaluates new paths for revenue growth from existing clients.',
        'Able to take an accurate and informed verbal briefing from a client and able to write a reverse brief for Director review.',
        'Proven ability to contribute to winning proposals using Kantar Achievers Scheme. Ensures quality and that senior review takes place on all proposals.'
      ]
    },
    {
      title: 'Project Management',
      items: [
        'Responsible for monitoring team against project milestones; can identify basic complexity risks and solutions, escalates issues to AD level and above.',
        'Develops medium-complexity questionnaires. Ensures questions are aligned with client objectives. Can accurately estimate length of a questionnaire prior to it being written (based on client requirements).',
        'Uses appropriate strategies to reduce questionnaire length (including impact on analysis, how to deal with client, etc.) if necessary.',
        'Evident as a go-to expert for junior staff on projects processes. Identifies current training gaps in team.',
        'Responsible for managing project capacity and effective resourcing.',
        'Leads SDM ways of working and coaches on best practice across relevant projects',
        'Seeks to streamline and look for automation opportunities that they could help activate'
      ]
    },
    {
      title: 'Delivery and Execution',
      items: [
        'Manages the implementation of the Kantar Achievers Scheme framework on all their accounts.',
        'Uses the most effective tools to produce all relevant tables necessary. Can effectively plan and support analysis and reporting around clients real business issues.',
        'Instigates and leads the data analysis to answer the clients business questions.',
        'Creates a clear, accurate storyline and writing insightful, concise and compelling reports.',
        'Can create a document with clear logic and flow that is client ready.',
        'Able to present selected parts of the presentation of research results for own projects. Can effectively contribute to workshops.'
      ]
    },
    {
      title: 'People Management',
      items: [
        'Self: Seeks development options for self based learning on an understanding of individual strengths, capabilities and weaknesses.',
        'Others: Provides on the job coaching for junior staff. Identifies, acknowledges and deals with good/poor performance. Ensures team are making the most of training opportunities. Celebrates self and team success and ensures involvement in office related activities and initiatives. Provides actionable feedback and drives accountability.'
      ]
    },
    {
      title: 'Commercial Acumen',
      items: [
        'Reviews and Monitors project profitability reports analysis; Basic negotiation skills.',
        'Support delivery of budgeted NS and profit; Completes accurate project estimates and understands impact of pricing decisions',
        '100% compliance of weekly accurate timesheet submissions.',
        'Understands the impact of their time spent on job profitability and utilisation'
      ]
    }
  ],
  'senior-client-manager': [
    {
      title: 'Managing Clients and Relationships',
      items: [
        'Leads strategic client relationships and manages complex stakeholder expectations',
        'Develops and maintains strong relationships with senior client stakeholders',
        'Proactively identifies and pursues new business opportunities',
        'Provides strategic guidance on complex project design and implementation',
        'Manages high-complexity project costs and timelines effectively'
      ]
    },
    {
      title: 'Winning and Selling Work',
      items: [
        'Takes lead role in proposal development and pitching',
        'Develops creative approaches to proposal delivery',
        'Identifies and pursues strategic opportunities for account growth',
        'Contributes to practice area strategy and development'
      ]
    },
    {
      title: 'Project Management',
      items: [
        'Manages complex project portfolios independently',
        'Identifies and resolves high-complexity risks and challenges',
        'Provides strategic direction on questionnaire design and methodology',
        'Mentors team members on project management best practices',
        'Champions efficiency and automation initiatives',
        'Leads implementation of best practices across projects'
      ]
    },
    {
      title: 'Delivery and Execution',
      items: [
        'Ensures excellence in project delivery and client satisfaction',
        'Provides strategic guidance on analysis and reporting',
        'Leads development of innovative solutions to client challenges',
        'Presents complex findings to senior stakeholders effectively',
        'Facilitates strategic workshops and client sessions'
      ]
    },
    {
      title: 'People Management',
      items: [
        'Develops and mentors junior team members',
        'Implements effective performance management practices',
        'Drives positive team culture and engagement',
        'Provides strategic guidance on career development',
        'Manages team resources and capacity effectively'
      ]
    },
    {
      title: 'Commercial Acumen',
      items: [
        'Manages complex project financials and budgets',
        'Develops and implements pricing strategies',
        'Ensures project and account profitability',
        'Identifies and pursues growth opportunities',
        'Maintains high standards of financial reporting and compliance'
      ]
    }
  ],
  'associate-director': [
    {
      title: 'Managing Clients and Relationships',
      items: [
        'Overall responsibility for leading some accounts in the team independently.',
        'Proven ability at fostering briefs and new business opportunities with client.',
        'Manages business focussed conversations with client to understand their context.',
        'Designs the best research solution to answer the business question. Negotiates with client to ensure scope is maintained.',
        'Manages client feedback and resolves complaints for the accounts they are leading.'
      ]
    },
    {
      title: 'Winning and Selling Work',
      items: [
        'Leads wins with new and existing clients. Able to take an accurate and informed verbal briefing from a client and able to write a reverse brief. Identifies cross-solve opportunities on accounts and instigates reverse brief / REVEAL opportunities with BD, Solution and Group Director.',
        'Accountable for checking quality and delivery of all proposals in team.'
      ]
    },
    {
      title: 'Project Management',
      items: [
        'Oversees on time delivery of project and manages escalation conversations with client',
        'Signs off on complex questionnaires and challenges client thinking on questionnaire design.',
        'Ensures QLIB is utilised in the most effective way, consistently and on all appropriate projects.',
        'Is able to identify future capacity crunches and manage resource effectively',
        'Challenges SDM ways of working to business'
      ]
    },
    {
      title: 'Delivery and Execution',
      items: [
        'Champions the implementation of the Kantar Achievers Scheme framework across the business.',
        'Directs the analysis required to answer the business questions; coaches the team to continually deliver best in class analysis and insight.',
        'Advises on a clear, accurate storyline and writing insightful, concise and compelling reports and is responsible for sign off and quality of reports.',
        'Able to adapt reports and presentations to meet the specific needs of the audience. Is an effective and engaging presenter and is able to confidently present others work'
      ]
    },
    {
      title: 'People Management',
      items: [
        'Self: Is aware of own goals and looks for opportunities either locally/regionally or globally to achieve these. Remains positive and responds to pressure in a calm, considered manner when approached.',
        'Others: Starts to assume line management responsibilities of at least 1-3 line reports. Is beginning to flex management style to get the best out of direct reports and team members. Accountable for leading the Meaningful Personal Growth development of their direct reports, and advocates for opportunities which meet direct reports career progression. Effectively communicates any business changes to team in a positive and collaborative manner.'
      ]
    },
    {
      title: 'Commercial Acumen',
      items: [
        'Intermediate negotiation skills (negotiates with clients on costs/timelines and scope).',
        'Responsible for delivering on budgeted NS and profit; Identifies recurring cost overruns/other risk factors on projects.',
        'Manages client base to target profitability levels; ensures team utilisation levels.',
        'Manage profit through effective resource planning and sharing.',
        'Accountable for providing accurate and timely financial data (pipeline, acceptances, completions, phasing).',
        'Coaches staff around financial acumen & issues. Proven ability at resolving financial issues timeously (negotiating fee increases, scope creep, and securing overdue payments).'
      ]
    }
  ]
};