import { stringify as toYAML } from 'yaml'
import { ActionName, ActionOptions } from './actions'
import { kebabizeObject } from './helpers/kebabize'

type OnOptions = [string, Record<string, any>?] | string

type JobOptions = {}

type StepOptions<Action extends ActionName | undefined = undefined> = {
    uses?: Action
} & (Action extends keyof ActionOptions ? { with: ActionOptions[Action] } : Record<string, any>)

class Step<Action extends ActionName | undefined = undefined> {
    name: string
    options: Partial<StepOptions<Action>>
    commands: string[] | undefined = undefined

    constructor(name: string, options: Partial<StepOptions<Action>> = {}) {
        this.name = name
        this.options = options;
    }

    run(command: string): Step<Action> {
        this.commands ??= []
        this.commands.push(command)
        return this;
    }

    toJSON() {
        return {
            name: this.name,
            ...kebabizeObject(this.options),
            run: this.commands?.join('\n')
        }
    }
}

class Job {
    name: string;
    options: JobOptions;
    #steps: Step<any>[] = [];

    constructor(name: string, options: JobOptions = {}) {
        this.name = name
        this.options = options;
    }

    step(name: string, stepCb?: (step: Step) => void): Job
    step(name: string, options: StepOptions, stepCb?: (step: Step) => void): Job
    step(name: string, optionsOrStepCb: (StepOptions | ((step: Step) => void)) = {}, stepCb?: (step: Step) => void): Job {
        const options = typeof optionsOrStepCb === 'function' ? {} : optionsOrStepCb;
        const step = new Step(name, options);
        if (typeof optionsOrStepCb === 'function')
            optionsOrStepCb(step);
        else
            stepCb?.(step);
        this.#steps.push(step);
        return this;
    }

    use<Action extends ActionName>(name: string, action: Action, options: Partial<Action extends keyof ActionOptions ? { with: ActionOptions[Action], [x: string | number | symbol]: unknown; } : Record<string, unknown>> = {}): Job {
        this.#steps.push(new Step<Action>(name, { uses: action, ...options }));
        return this;
    }

    toJSON() {
        return { ...kebabizeObject(this.options), steps: this.#steps.map(step => step.toJSON()) };
    }
}

class Workflow {
    name: string
    #jobs: Job[] = []
    #ons: OnOptions[] = []

    constructor(name: string) {
        this.name = name
    }

    on(...args: OnOptions[]): Workflow {
        this.#ons.push(...args)
        return this
    }

    job(name: string, jobCb?: (job: Job) => void): Workflow
    job(name: string, options: JobOptions, jobCb?: (job: Job) => void): Workflow
    job(name: string, optionsOrJobCb: (JobOptions | ((job: Job) => void)) = {}, jobCb?: (job: Job) => void): Workflow {
        const options = typeof optionsOrJobCb === 'function' ? {} : optionsOrJobCb;
        const job = new Job(name, options)
        if (typeof optionsOrJobCb === 'function')
            optionsOrJobCb(job);
        else
            jobCb?.(job)
        this.#jobs.push(job)
        return this
    }

    toJSON() {
        return {
            name: this.name,
            on: this.#ons.map((on) => {
                if (typeof on === 'string') return on;
                const [event, options] = on
                return !options ? event : { [event]: options }
            }),
            jobs: Object.fromEntries(this.#jobs.map(job => [job.name, job.toJSON()]))
        }
    }

    toYAML(): string {
        return toYAML(this.toJSON(), {
            indent: 2,
            singleQuote: true
        })
    }
}

export const createWorkflow = (name: string) => new Workflow(name)