---
name: Activity
desc: The activity model.
src: https://github.com/kt3k/buttons/blob/master/src/domain/activity.js
edit: https://github.com/kt3k/buttons/edit/master/src/domain/activity.md
props:
- name: id
  type: string
  desc: The id of the button
- name: type
  type: string
  desc: The type of the activity, 'push' | 'create' | 'join'
- name: user
  type: User
  desc: The the user of the activity
- name: button
  type: Button
  desc: The button of the activity
- name: info
  type: Object
  desc: The additional informatio of the activity
- name: date
  type: Date
  desc: The time of the activity
---
