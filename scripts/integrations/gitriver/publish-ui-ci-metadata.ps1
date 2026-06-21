<#
.SYNOPSIS
    Publishes nettoolskit-ui GitRiver CI metadata through Access.

.DESCRIPTION
    Delegates GitRiver repository creation, workflow metadata publication, and
    masked CI variable synchronization to the Access integration script. Access
    remains the Bitwarden and GitRiver control-plane owner; this repository
    supplies only `.gitriver/workflows` metadata and source-owned River gates.

.EXAMPLE
    pwsh -NoLogo -NoProfile -File scripts/integrations/gitriver/publish-ui-ci-metadata.ps1 -AccessRepositoryRoot C:\path\to\nettoolskit-access -DryRun
#>
[CmdletBinding()]
param(
    [string] $ProjectRoot,
    [string] $AccessRepositoryRoot,
    [string] $CiUrl,
    [string] $MetadataRepositoryName = 'nettoolskit-ui-ci',
    [string] $GitHubSourceOwner = 'NetToolsKit',
    [string] $SharedBitwardenProjectName = 'NetToolsKit',
    [string] $GitHubSourceRef,
    [switch] $DryRun
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Resolve-RepositoryRoot {
    param([string] $RequestedRoot)

    if (-not [string]::IsNullOrWhiteSpace($RequestedRoot)) {
        return (Resolve-Path -LiteralPath $RequestedRoot).Path
    }

    $scriptRoot = Split-Path -Parent $PSCommandPath
    return (Resolve-Path -LiteralPath (Join-Path $scriptRoot '..\..\..')).Path
}

function Resolve-AccessRepositoryRoot {
    param(
        [string] $RequestedRoot,
        [string] $UiRoot
    )

    if (-not [string]::IsNullOrWhiteSpace($RequestedRoot)) {
        return (Resolve-Path -LiteralPath $RequestedRoot).Path
    }

    if (-not [string]::IsNullOrWhiteSpace($env:NETTOOLSKIT_ACCESS_ROOT)) {
        $envCandidate = Join-Path $env:NETTOOLSKIT_ACCESS_ROOT 'scripts/integrations/gitriver/publish-ci-metadata.ps1'
        if (Test-Path -LiteralPath $envCandidate) {
            return (Resolve-Path -LiteralPath $env:NETTOOLSKIT_ACCESS_ROOT).Path
        }
    }

    $candidate = Join-Path (Split-Path -Parent $UiRoot) 'nettoolskit-access'
    if (Test-Path -LiteralPath (Join-Path $candidate 'scripts/integrations/gitriver/publish-ci-metadata.ps1')) {
        return (Resolve-Path -LiteralPath $candidate).Path
    }

    throw 'Access repository root was not found. Pass -AccessRepositoryRoot or set NETTOOLSKIT_ACCESS_ROOT.'
}

$uiRoot = Resolve-RepositoryRoot -RequestedRoot $ProjectRoot
$accessRoot = Resolve-AccessRepositoryRoot -RequestedRoot $AccessRepositoryRoot -UiRoot $uiRoot
$publisher = Join-Path $accessRoot 'scripts/integrations/gitriver/publish-ci-metadata.ps1'

$arguments = @(
    '-NoLogo',
    '-NoProfile',
    '-File',
    $publisher,
    '-ProjectRoot',
    $accessRoot,
    '-WorkflowSourceRoot',
    $uiRoot,
    '-MetadataRepositoryName',
    $MetadataRepositoryName,
    '-GitHubSourceOwner',
    $GitHubSourceOwner,
    '-SharedBitwardenProjectName',
    $SharedBitwardenProjectName
)

if (-not [string]::IsNullOrWhiteSpace($CiUrl)) {
    $arguments += @('-CiUrl', $CiUrl)
}

if (-not [string]::IsNullOrWhiteSpace($GitHubSourceRef)) {
    $arguments += @('-GitHubSourceRef', $GitHubSourceRef)
}

if ($DryRun) {
    $arguments += '-DryRun'
}

try {
    & pwsh @arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Access GitRiver metadata publisher failed with exit code $LASTEXITCODE."
    }

    exit 0
}
catch {
    Write-Error $_
    exit 1
}