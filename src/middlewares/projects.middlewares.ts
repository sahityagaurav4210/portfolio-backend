import { ApiResponse, HTTP_STATUS_CODES, Status } from '@api/index';
import { ProjectDomain, ProjectType } from '../constant';
import { HandleException } from '@decorators/exception.decorator';
import { ValidationMessages } from '@helpers/messages.helper';
import { IProjectCreateDTO, IProjectUpdateDTO } from '@interfaces/projects.interface';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

class ProjectsMiddleware {
  @HandleException()
  public static async createProjectValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const reply = new ApiResponse();
    const payload = { ...request.body };

    if (typeof payload.tech_stack === 'string') {
      try {
        payload.tech_stack = JSON.parse(payload.tech_stack);
      } catch {
        payload.tech_stack = payload.tech_stack
          ? payload.tech_stack
              .split(',')
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [];
      }
    }

    if (typeof payload.disabled === 'string') {
      payload.disabled = payload.disabled === 'true';
    }
    if (typeof payload.ongoing === 'string') {
      payload.ongoing = payload.ongoing === 'true';
    }
    if (typeof payload.showDivider === 'string') {
      payload.showDivider = payload.showDivider === 'true';
    }
    if (typeof payload.priority === 'string') {
      payload.priority = Number(payload.priority);
    }

    request.body = payload;

    const schema = Joi.object<IProjectCreateDTO>().keys({
      name: Joi.string().min(2).max(100).required().messages(ValidationMessages.projects.name),
      text: Joi.string().min(5).max(5000).required().messages(ValidationMessages.projects.text),
      tech_stack: Joi.array()
        .items(Joi.string().min(1).max(50).messages(ValidationMessages.projects.tech_stack))
        .default([])
        .messages(ValidationMessages.projects.tech_stack),
      type: Joi.string()
        .valid(...Object.values(ProjectType))
        .required()
        .messages(ValidationMessages.projects.type),
      projectDomain: Joi.string()
        .valid(...Object.values(ProjectDomain))
        .required()
        .messages(ValidationMessages.projects.projectDomain),
      disabled: Joi.boolean().optional().messages(ValidationMessages.projects.disabled),
      ongoing: Joi.boolean().optional().messages(ValidationMessages.projects.ongoing),
      showDivider: Joi.boolean().optional().messages(ValidationMessages.projects.showDivider),
      cardImage: Joi.string()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.cardImage),
      liveLink: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.liveLink),
      codeLink: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.codeLink),
      documentation_link: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.documentation_link),
      priority: Joi.number().optional().messages(ValidationMessages.projects.priority),
      note: Joi.string().optional().messages(ValidationMessages.projects.note),
    });

    const validationResult = schema.validate(payload, { abortEarly: true, allowUnknown: true });

    if (validationResult.error) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = validationResult.error.details[0].message;
      reply.DATA = validationResult.error.details[0];
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.INV_PAYLOAD).json(reply);
    }

    return next();
  }

  @HandleException()
  public static async updateProjectValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const reply = new ApiResponse();
    const payload = { ...request.body };

    if (typeof payload.tech_stack === 'string') {
      try {
        payload.tech_stack = JSON.parse(payload.tech_stack);
      } catch {
        payload.tech_stack = payload.tech_stack
          ? payload.tech_stack
              .split(',')
              .map((item: string) => item.trim())
              .filter(Boolean)
          : [];
      }
    }

    if (typeof payload.disabled === 'string') {
      payload.disabled = payload.disabled === 'true';
    }
    if (typeof payload.ongoing === 'string') {
      payload.ongoing = payload.ongoing === 'true';
    }
    if (typeof payload.showDivider === 'string') {
      payload.showDivider = payload.showDivider === 'true';
    }
    if (typeof payload.priority === 'string') {
      payload.priority = Number(payload.priority);
    }

    request.body = payload;

    const schema = Joi.object<IProjectUpdateDTO>().keys({
      name: Joi.string().min(2).max(100).optional().messages(ValidationMessages.projects.name),
      text: Joi.string().min(5).max(5000).optional().messages(ValidationMessages.projects.text),
      tech_stack: Joi.array()
        .items(Joi.string().min(1).max(50).messages(ValidationMessages.projects.tech_stack))
        .optional()
        .messages(ValidationMessages.projects.tech_stack),
      type: Joi.string()
        .valid(...Object.values(ProjectType))
        .optional()
        .messages(ValidationMessages.projects.type),
      disabled: Joi.boolean().optional().messages(ValidationMessages.projects.disabled),
      ongoing: Joi.boolean().optional().messages(ValidationMessages.projects.ongoing),
      showDivider: Joi.boolean().optional().messages(ValidationMessages.projects.showDivider),
      cardImage: Joi.string()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.cardImage),
      liveLink: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.liveLink),
      codeLink: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.codeLink),
      documentation_link: Joi.string()
        .uri()
        .optional()
        .allow(null, '')
        .messages(ValidationMessages.projects.documentation_link),
      priority: Joi.number().optional().messages(ValidationMessages.projects.priority),
    });

    const validationResult = schema.validate(payload, { abortEarly: true, allowUnknown: true });

    if (validationResult.error) {
      reply.STATUS = Status.VALIDATION;
      reply.MESSAGE = validationResult.error.details[0].message;
      reply.DATA = validationResult.error.details[0];
      reply.ENTRY_BY = request.ip || '0.0.0.0';

      return response.status(HTTP_STATUS_CODES.INV_PAYLOAD).json(reply);
    }

    return next();
  }
}

export default ProjectsMiddleware;
