# -*- coding: utf-8 -*-


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20160211_2019'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='element',
            name='concept',
        ),
    ]
