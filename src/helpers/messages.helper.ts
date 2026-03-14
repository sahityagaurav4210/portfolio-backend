const ValidationMessages = {
  portfolio: {
    heroSection: {
      profilePic: {
        'string.base': 'Profile picture must be a string.',
        'string.min': 'Too short profile picture url.',
        'string.max': 'Too large profile picture url.',
      },
      description: {
        'string.base': 'Description must be a string.',
        'any.required': 'Description is required',
        'string.min': 'Too short description.',
        'string.max': 'Too large description.',
      },
    },
    homeSection: {
      displayName: {
        'string.base': 'Display name must be a string.',
        'string.pattern.base': 'Invalid display name',
        'any.required': 'Display name is required',
      },
      url: {
        'string.base': 'Profile url must be a string.',
        'string.pattern.base': 'Invalid url',
      },
      specialization: {
        'string.base': 'Specialization must be a string.',
      },
      about: {
        'string.base': 'About must be a string.',
        'string.min': 'Your description is too short.',
        'string.max': 'Your description is too long.',
        'any.required': 'Your description is required',
      },
      projectsDelivered: {
        'number.base': 'Projects delivered count must be a number.',
        'number.min': 'Your projects delivered count is too short.',
      },
      experience: {
        'number.base': 'Experience must be a number.',
      },
      codingQuestionSolved: {
        'number.base': 'Coding question solved count must be a number.',
      },
      activeGithubContributions: {
        'number.base': 'Active github contributions must be a number.',
      },
      designation: {
        'string.base': 'Designation must be a string.',
        'any.required': 'Designation is required',
      },
    },
    projectSection: {
      name: {
        'string.base': 'Project name should be a string.',
        'string.min': 'Too short project name.',
        'string.max': 'Too large project name.',
        'string.pattern.base': 'Invalid project name.',
      },
      tech_stack: {
        'string.base': 'Tech stack should be a string.',
        'string.min': 'Too short tech stack.',
        'string.max': 'Too large tech stack.',
        'any.requried': 'Tech stack is required',
      },
      live_link: {
        'string.base': 'Live link should be a string.',
        'string.min': 'Too short live link.',
        'string.max': 'Too large live link.',
      },
      documentation_link: {
        'string.base': 'Documentation link should be a string.',
        'string.min': 'Too short documentation link.',
        'string.max': 'Too large documentation link.',
      },
      code_link: {
        'string.base': 'Code link should be a string.',
        'string.min': 'Too short code link.',
        'string.max': 'Too large code link.',
        'any.required': 'Code link is required',
      },
      project_type: {
        'string.base': 'Project type should be a string.',
        'string.min': 'Too short Project type.',
        'string.max': 'Too large Project type.',
        'any.required': 'Project type is required.',
      },
      disabled: {
        'bool.base': 'Invalid project status type.',
        'any.required': 'Project status is required.',
      },
    },
    skillSection: {
      name: {
        'string.base': 'Skill name should be a string.',
        'string.min': 'Too short skill name.',
        'string.max': 'Too large skill name.',
        'string.pattern.base': 'Invalid skill name.',
      },
      experience: {
        'number.base': 'Experience should be a number.',
      },
      url: {
        'string.base': 'Skill url should be a string.',
        'string.min': 'Too short skill name.',
        'string.max': 'Too large skill name.',
        'string.pattern.base': 'Invalid skill name.',
      },
    },
  },
  hiring: {
    client_name: {
      'string.base': 'Client name must be a string.',
      'string.pattern.base': 'Invalid client name.',
      'any.required': 'Client name is required.',
      'string.min': 'Client name is too short.',
    },
    client_email: {
      'string.base': 'Client email must be a string.',
      'string.pattern.base': 'Invalid client email.',
      'any.required': 'Client email is required.',
      'string.min': 'Client email is too short.',
    },
    client_project_name: {
      'string.base': "Client's project name must be a string.",
      'string.pattern.base': 'Invalid client project name.',
      'any.required': 'Client project name is required.',
      'string.min': 'Client project name is too short.',
    },
    tenure: {
      'number.base': 'Tenure must be a number.',
      'number.min': 'Your tenure is too short.',
      'number.max': 'Your tenure is too long.',
    },
    hiring_type: {
      'string.base': 'Hiring type must be a string.',
      'any.required': 'Hiring type is required.',
      'string.valid': 'Invalid hiring type.',
    },
    budget: {
      'string.base': 'Budget must be a string.',
      'string.min': 'Your budget is too short.',
      'string.max': 'Your budget is too long.',
      'any.required': 'Budget is required.',
    },
    message: {
      'string.base': 'Message must be a string.',
      'any.required': 'Message is required.',
    },
    project_desc: {
      'string.base': 'Project description must be a string.',
      'any.required': 'Project description is required.',
    },
    terms: {
      'boolean.base': 'Invalid term value.',
      'any.required': 'Term is required.',
    },
    captchaId: {
      'number.base': 'Invalid captcha id format.',
      'any.required': 'Captcha Id is required.',
    },
  },
  contact: {
    first_name: {
      'string.base': 'First name must be a string.',
      'any.required': 'First name is required.',
      'string.min': 'First name is too short.',
    },
    last_name: {
      'string.base': 'Last name must be a string.',
      'string.min': 'Last name is too short.',
    },
    email: {
      'string.base': 'Email must be a string.',
      'any.required': 'Email is required.',
      'string.min': 'Email is too short.',
      'string.pattern.base': 'Invalid email.',
    },
    message: {
      'string.base': 'Message must be a string.',
      'any.required': 'Message is required.',
      'string.min': 'Message is too short.',
      'string.max': 'Message is too long.',
      'string.pattern.base': 'Invalid contact message.',
    },
    captchaId: {
      'number.base': 'Captcha Id must be a number.',
      'any.required': 'Captcha Id is required.',
    },
  },
  client_token: {
    'string.base': 'Client token must be a string.',
    'string.min': 'Too short client token.',
    'string.max': 'Too large client token.',
    'any.required': 'Client token is required',
  },
  resume: {
    websites: {
      'string.base': 'Website must be a string.',
      'any.required': 'Website url is requried',
      'sting.pattern.base': "Invalid website url."
    }
  },
  commons: {
    description: {
      'string.base': 'Description must be a string.',
      'any.required': 'Description is required',
      'string.min': 'Too short description.',
      'string.max': 'Too large description.',
    },
    optional: {
      string: (feildName: string) => ({
        'string.base': `${feildName} must be a string`,
      }),
      number: (feildName: string) => ({
        'number.base': `${feildName} must be a number.`,
      }),
    },
  },
  types: {
    array: {
      'array.base': 'Invalid section type.',
      'array.min': 'Too short section',
      'array.max': 'Too large section',
      'any.required': 'This section is required',
    },
    string: {
      'string.base': 'Item must be a string.',
    },
  },
};

export { ValidationMessages };
