-- @param {String} $1: parentId of the comment
WITH RECURSIVE comment_tree AS (
    SELECT 
        c.id,
        c.content,
        c."userId",
        c."stampId",
        c."parentId",
        EXTRACT(EPOCH FROM c."createdAt") AS "createdAt",
        EXTRACT(EPOCH FROM c."updatedAt") AS "updatedAt",
        0 AS level,
        json_build_object(
            'username', u.username,
            'usernameURL', u."usernameURL",
            'image', u.image
        ) AS user,
        json_build_object(
            'id', parent_u.id,
            'username', parent_u.username,
            'usernameURL', parent_u."usernameURL"
        ) AS "replyToUser"
    FROM 
        "Comment" c
	  JOIN "User" u ON c."userId" = u.id
    LEFT JOIN "Comment" parent_c ON c."parentId" = parent_c.id  
    LEFT JOIN "User" parent_u ON parent_c."userId" = parent_u.id
    WHERE 
        c."parentId" = $1

    UNION ALL

    SELECT 
        c.id,
        c.content,
        c."userId",
        c."stampId",
        c."parentId",
        EXTRACT(EPOCH FROM c."createdAt") AS "createdAt",
        EXTRACT(EPOCH FROM c."updatedAt") AS "updatedAt",
        ct.level + 1,
        json_build_object(
            'username', u.username,
            'usernameURL', u."usernameURL",
            'image', u.image
        ) AS user,
        json_build_object(
            'id', parent_u.id,
            'username', parent_u.username,
            'usernameURL', parent_u."usernameURL"
        ) AS "replyToUser"
    FROM "Comment" c
	  JOIN "User" u ON c."userId" = u.id
    LEFT JOIN "Comment" parent_c ON c."parentId" = parent_c.id  
    LEFT JOIN "User" parent_u ON parent_c."userId" = parent_u.id
    JOIN comment_tree ct ON c."parentId" = ct.id
)
SELECT * FROM comment_tree
ORDER BY "createdAt"