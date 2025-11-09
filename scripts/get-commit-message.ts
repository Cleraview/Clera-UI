type ReleasePlan = {
  releases: Array<{
    oldVersion: string
    newVersion: string
  }>
}
export default async function getCommitMessage(releasePlan: ReleasePlan) {
  const release = releasePlan.releases[0];

  if (!release) {
    return "chore(release): version packages";
  }

  const { oldVersion, newVersion } = release;

  return `chore(release): bump version ${oldVersion} to ${newVersion}`;
}