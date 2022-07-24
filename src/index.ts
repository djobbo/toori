import { stringify as toYAML } from 'yaml'
import { ActionName, ActionOptions } from './actions'
import { Event, EventName, EventOptions, DefaultEventOptions } from './eventTypes'
import { kebabizeObject } from './helpers/kebabize'

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
    #events: Event[] = []

    constructor(name: string) {
        this.name = name
    }

    on(event: 'cron', options: string): Workflow
    on<E extends keyof DefaultEventOptions>(event: E, options?: DefaultEventOptions[E]): Workflow
    on<E extends EventName>(event: E, options: EventOptions[E] | undefined = undefined): Workflow {
        if (event === 'cron') {
            if (typeof options !== 'string') throw new Error('Cron event requires a string as options')
            return this.on('schedule', [{ cron: options }])
        }

        if (!options)
            this.#events.push(event)
        else {
            if (typeof options !== 'object') throw new Error(`Event [${event}] options must be an object`)
            this.#events.push([event, kebabizeObject(options)])
        }
        return this
    }

    #onBuilder<E extends keyof DefaultEventOptions>(event: E) {
        return (options?: EventOptions[E]) => this.on(event, options)
    }

    // Github events
    onBranchProtectionRule = this.#onBuilder('branch_protection_rule')
    onCheckRun = this.#onBuilder('check_run')
    onCheckSuite = this.#onBuilder('check_suite')
    onCreate = this.#onBuilder('create')
    onDelete = this.#onBuilder('delete')
    onDeployment = this.#onBuilder('deployment')
    onDeploymentStatus = this.#onBuilder('deployment_status')
    onDiscussion = this.#onBuilder('discussion')
    onDiscussionComment = this.#onBuilder('discussion_comment')
    onFork = this.#onBuilder('fork')
    onGollum = this.#onBuilder('gollum')
    onIssueComment = this.#onBuilder('issue_comment')
    onIssues = this.#onBuilder('issues')
    onLabel = this.#onBuilder('label')
    onMilestone = this.#onBuilder('milestone')
    onPageBuild = this.#onBuilder('page_build')
    onProject = this.#onBuilder('project')
    onProjectCard = this.#onBuilder('project_card')
    onProjectColumn = this.#onBuilder('project_column')
    onPublic = this.#onBuilder('public')
    onPullRequest = this.#onBuilder('pull_request')
    onPullRequestComment = this.#onBuilder('pull_request_comment')
    onPullRequestReview = this.#onBuilder('pull_request_review')
    onPullRequestReviewComment = this.#onBuilder('pull_request_review_comment')
    onPullRequestTarget = this.#onBuilder('pull_request_target')
    onPush = this.#onBuilder('push')
    onRegistryPackage = this.#onBuilder('registry_package')
    onRelease = this.#onBuilder('release')
    onRepositoryDispatch = this.#onBuilder('repository_dispatch')
    onSchedule = this.#onBuilder('schedule')
    onStatus = this.#onBuilder('status')
    onWatch = this.#onBuilder('watch')
    onWorkflowCall = this.#onBuilder('workflow_call')
    onWorkflowDispatch = this.#onBuilder('workflow_dispatch')
    onWorkflowRun = this.#onBuilder('workflow_run')

    // Custom events
    onCron(cron: string): Workflow {
        return this.on('cron', cron)
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
            on: this.#events.map((on) => {
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
