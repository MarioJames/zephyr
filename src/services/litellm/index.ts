import { litellmEnv } from '@/env/litellm';

function getLitellmTeamId(roleId: string) {
  return `role_${roleId}`;
}

export const generateApiKeyAlias = (userId: string, roleId: string): string => {
  return `${userId}_role_${roleId}`;
};

/**
 * 创建团队用户
 * @param userId 用户ID
 * @param roleId 角色ID
 * @returns 创建结果
 */
async function createTeamUser(userId: string, roleId: string) {
  const teamId = getLitellmTeamId(roleId);

  const response = await fetch(
    `${litellmEnv.LITELLM_BASE_URL}/team/member_add`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${litellmEnv.LITELLM_MASTER_KEY}`,
      },
      body: JSON.stringify({
        member: {
          role: 'user',
          user_id: userId,
        },
        team_id: teamId,
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    if ('error' in data.error) throw data.error.error;
    throw data.error;
  }

  return response.json();
}

/**
 * 删除团队用户
 * @param userId 用户ID
 * @param roleId 角色ID
 * @returns 删除结果
 */
async function deleteTeamUser(userId: string, roleId: string) {
  const teamId = getLitellmTeamId(roleId);

  const response = await fetch(
    `${litellmEnv.LITELLM_BASE_URL}/team/member_delete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${litellmEnv.LITELLM_MASTER_KEY}`,
      },
      body: JSON.stringify({
        team_id: teamId,
        user_id: userId,
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    if ('error' in data.error) throw data.error.error;
    throw data.error;
  }

  return response.json();
}

/**
 * 创建虚拟KEY
 * @param userId 用户ID
 * @param roleId 角色ID
 * @returns 创建结果
 */
async function createVirtualKey(
  userId: string,
  roleId: string,
  tokenBudget?: number
) {
  const teamId = getLitellmTeamId(roleId);

  const apiKeyParams = {
    key_alias: generateApiKeyAlias(userId, teamId),
    max_budget: tokenBudget ?? 0,
    budget_duration: '1mo',
    models: ['all-team-models'],
    metadata: {
      created_by: 'RBAC_SYSTEM_CREATOR',
      role_id: roleId,
    } as any,
    send_invite_email: false,
    team_id: teamId,
    user_id: userId,
  };

  const response = await fetch(`${litellmEnv.LITELLM_BASE_URL}/key/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${litellmEnv.LITELLM_MASTER_KEY}`,
    },
    body: JSON.stringify(apiKeyParams),
  });

  const data = await response.json();

  if (data.error) {
    if ('error' in data.error) throw data.error.error;
    throw data.error;
  }

  return response.json();
}

/**
 * 更新虚拟KEY
 * @param userId 用户ID
 * @param roleId 角色ID
 * @returns 更新结果
 */
async function blockVirtualKey(virtualKeyId: string) {
  const response = await fetch(`${litellmEnv.LITELLM_BASE_URL}/key/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${litellmEnv.LITELLM_MASTER_KEY}`,
    },
    body: JSON.stringify({
      key: virtualKeyId,
      blocked: true,
    }),
  });

  const data = await response.json();

  if (data.error) {
    if ('error' in data.error) throw data.error.error;
    throw data.error;
  }
}

export default {
  createTeamUser,
  deleteTeamUser,
  createVirtualKey,
  blockVirtualKey,
};
