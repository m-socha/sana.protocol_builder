# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-10-10 01:53
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_auto_20180314_0655'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pushevent',
            name='procedure',
        ),
        migrations.DeleteModel(
            name='PushEvent',
        ),
    ]