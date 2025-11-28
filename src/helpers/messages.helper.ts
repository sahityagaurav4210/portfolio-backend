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
        'string.base': 'Specialization must be a string.'
      },
      about: {
        'string.base': 'About must be a string.',
        'string.min': 'Your description is too short.',
        'string.max': 'Your description is too long.',
        'any.required': 'Your description is required',
      },
      projectsDelivered: {
        'number.base': "Projects delivered count must be a number.",
        'number.min': 'Your projects delivered count is too short.'
      },
      experience: {
        'number.base': "Experience must be a number.",
      },
      codingQuestionSolved: {
        'number.base': "Coding question solved count must be a number."
      },
      activeGithubContributions: {
        'number.base': "Active github contributions must be a number."
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
  client_token: {
    'string.base': 'Client token must be a string.',
    'string.min': 'Too short client token.',
    'string.max': 'Too large client token.',
    'any.required': 'Client token is required',
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
        'string.base': `${feildName} must be a string`
      }),
      number: (feildName: string) => ({
        'number.base': `${feildName} must be a number.`
      }),
    }
  },
  types: {
    array: {
      'array.base': 'Invalid section type.',
      'array.min': 'Too short section',
      'array.max': 'Too large section',
      'any.required': 'This section is required',
    },
    string: {
      'string.base': "Item must be a string."
    }
  },
};

export { ValidationMessages };
