
type Branch = string;
type Tag = string;

type WorkflowInput<InputType extends 'boolean' | 'number' | 'string' = 'boolean' | 'number' | 'string'> = {
    type: InputType,
    description?: string,
    default?: InputType extends 'boolean' ? boolean : InputType extends 'number' ? number : string,
    required?: boolean,
}

type WorkflowSecret = {
    description?: string,
    required?: boolean,
}

type WorkflowOutput = {
    description?: string,
    value?: string,
}

type WorkflowDispatchInputBase = {
    description?: string,
    required?: boolean,
}

type WorkflowDispatchInput = WorkflowDispatchInputBase & (
    {
        type: 'string',
    } | {
        type: 'choice'
        choices: string[],
    } | {
        type: 'boolean'
    } | {
        type: 'environment'
    })

export type DefaultEventOptions = {
    //Github events
    'branch_protection_rule': { type?: ('created' | 'updated' | 'deleted')[] },
    'check_run': { type?: ('created' | 'rerequested' | 'completed' | 'requested_action')[] },
    'check_suite': { type?: 'completed'[] },
    'create': never,
    'delete': never,
    'deployment': never,
    'deployment_status': never,
    'discussion': {
        type?: (
            'created' |
            'edited' |
            'deleted' |
            'transferred' |
            'pinned' |
            'unpinned' |
            'labeled' |
            'unlabeled' |
            'locked' |
            'unlocked' |
            'category_changed' |
            'answered' |
            'unanswered'
        )[]
    },
    'discussion_comment': { type?: ('created' | 'edited' | 'deleted')[] },
    'fork': never,
    'gollum': never,
    'issue_comment': { type?: ('created' | 'edited' | 'deleted')[] },
    'issues': {
        type?: (
            'opened' |
            'edited' |
            'deleted' |
            'transferred' |
            'pinned' |
            'unpinned' |
            'closed' |
            'reopened' |
            'assigned' |
            'unassigned' |
            'labeled' |
            'unlabeled' |
            'locked' |
            'unlocked' |
            'milestoned' |
            'demilestoned'
        )[]
    },
    'label': { type?: ('created' | 'edited' | 'deleted')[] },
    'milestone': { type?: ('created' | 'closed' | 'opened' | 'edited' | 'deleted')[] },
    'page_build': never,
    'project': {
        type?: ('created' | 'closed' | 'reopened' | 'edited' | 'deleted')[]
    },
    'project_card': {
        type?: ('created' | 'moved' | 'converted' | 'edited' | 'deleted')[]
    },
    'project_column': {
        type?: ('created' | 'updated' | 'moved' | 'deleted')[]
    },
    'public': never,
    'pull_request': {
        type?: (
            'assigned' |
            'unassigned' |
            'labeled' |
            'unlabeled' |
            'opened' |
            'edited' |
            'closed' |
            'reopened' |
            'synchronize' |
            'converted_to_draft' |
            'ready_for_review' |
            'locked' |
            'unlocked' |
            'review_requested' |
            'review_request_removed' |
            'auto_merge_enabled' |
            'auto_merge_disabled'
        )[],
        branches?: Branch[],
        branchesIgnore?: Branch[], // TODO: check if this is converted to kebab case
        paths?: string[],
        pathsIgnore?: string[],
    },
    'pull_request_comment': never,
    'pull_request_review': {
        type?: ('submitted' | 'edited' | 'dismissed')[]
    },
    'pull_request_review_comment': {
        type?: ('created' | 'edited' | 'deleted')[]
    },
    'pull_request_target': {
        type?: (
            'assigned' |
            'unassigned' |
            'labeled' |
            'unlabeled' |
            'opened' |
            'edited' |
            'closed' |
            'reopened' |
            'synchronize' |
            'converted_to_draft' |
            'ready_for_review' |
            'locked' |
            'unlocked' |
            'review_requested' |
            'review_request_removed' |
            'auto_merge_enabled' |
            'auto_merge_disabled'
        )[],
        branches?: Branch[],
        branchesIgnore?: Branch[],
        paths?: string[],
        pathsIgnore?: string[],
    },
    'push': {
        branches?: Branch[],
        branchesIgnore?: Branch[],
        tags?: Tag[],
        tagsIgnore?: Tag[],
        paths?: string[],
        pathsIgnore?: string[],
    },
    'registry_package': {
        type?: (
            'published' |
            'updated'
        )[]
    },
    'release': {
        type?: (
            'published' |
            'unpublished' |
            'created' |
            'edited' |
            'deleted' |
            'prereleased' |
            'released'
        )[]
    },
    'repository_dispatch': {
        type?: string[]
    },
    'schedule': { cron: string }[],
    'status': never,
    'watch': { type?: ('started')[] },
    'workflow_call': {
        inputs?: Record<string, WorkflowInput>,
        outputs?: Record<string, WorkflowOutput>,
        secrets?: Record<string, WorkflowSecret>,
    },
    'workflow_dispatch': {
        inputs?: Record<string, WorkflowDispatchInput>,
    },
    'workflow_run': {
        type?: ('completed' | 'requested')[],
        branches?: Branch[],
        branchesIgnore?: Branch[],
    },
}

type CustomEventOptions = {
    // Custom events
    'cron': string
}

export type EventOptions = DefaultEventOptions & CustomEventOptions

export type EventName = keyof EventOptions


export type Event<Name extends EventName = EventName> = Name | [Name, EventOptions[Name]]
